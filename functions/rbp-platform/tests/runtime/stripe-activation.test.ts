import assert from "node:assert/strict";
import test from "node:test";
import Stripe from "stripe";

import { collectionIds, setAdminContextFactoryForTests } from "../../appwrite/functions/_shared/appwriteAdmin";
import { runNamedHandler } from "../../appwrite/functions/_shared/runtime";

type Document = Record<string, unknown> & { $id: string };
type Store = Record<string, Document[]>;

function parseQuery(query: string) {
  try {
    return JSON.parse(query) as { method?: string; attribute?: string; values?: unknown[] };
  } catch {
    return {};
  }
}

function memoryAdmin(seed: Partial<Store> = {}) {
  const store: Store = {
    [collectionIds.userProfiles]: [],
    [collectionIds.subscriptions]: [],
    [collectionIds.paymentEvents]: [],
    [collectionIds.tenantEntitlements]: [],
    [collectionIds.stripeCustomers]: [],
    [collectionIds.planEntitlements]: [
      { $id: "plan_premium", plan_code: "premium", entitlement_key: "membership", enabled: true },
    ],
    [collectionIds.notifications]: [],
    [collectionIds.notificationDeliveries]: [],
    [collectionIds.auditEvents]: [],
    ...seed,
  };
  let sequence = 0;
  const ensure = (collectionId: string) => {
    store[collectionId] ||= [];
    return store[collectionId];
  };
  const matches = (document: Document, queries: string[]) => queries.every((query) => {
    const parsed = parseQuery(query);
    if (parsed.method !== "equal" || !parsed.attribute) return true;
    return (parsed.values || []).map(String).includes(String(document[parsed.attribute]));
  });
  const admin = {
    teams: { async listMemberships() { return { memberships: [] }; } },
    async listDocuments(collectionId: string, queries: string[] = []) {
      return { documents: ensure(collectionId).filter((document) => matches(document, queries)) };
    },
    async getDocument(collectionId: string, documentId: string) {
      const document = ensure(collectionId).find((entry) => entry.$id === documentId);
      if (!document) throw new Error(`Missing ${collectionId}:${documentId}`);
      return document;
    },
    async createDocument(collectionId: string, data: Record<string, unknown>) {
      const document = { $id: `${collectionId}_${++sequence}`, ...data } as Document;
      ensure(collectionId).push(document);
      return document;
    },
    async updateDocument(collectionId: string, documentId: string, data: Record<string, unknown>) {
      const documents = ensure(collectionId);
      const index = documents.findIndex((entry) => entry.$id === documentId);
      if (index === -1) throw new Error(`Missing ${collectionId}:${documentId}`);
      documents[index] = { ...documents[index], ...data };
      return documents[index];
    },
    async findOne(collectionId: string, queries: string[]) {
      return (await this.listDocuments(collectionId, queries)).documents[0] || null;
    },
    async upsertByQuery(collectionId: string, queries: string[], data: Record<string, unknown>) {
      const existing = await this.findOne(collectionId, queries);
      if (existing) return { operation: "updated" as const, document: await this.updateDocument(collectionId, existing.$id, data) };
      return { operation: "created" as const, document: await this.createDocument(collectionId, data) };
    },
  };
  return { admin, store };
}

function signedEvent(id: string, type: string, object: Record<string, unknown>) {
  const event = {
    id,
    object: "event",
    api_version: "2025-02-24.acacia",
    created: 123,
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type,
    data: { object },
  };
  const payload = JSON.stringify(event);
  return {
    payload,
    signature: Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_test",
    }),
  };
}

test.afterEach(() => {
  setAdminContextFactoryForTests(null);
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_WEBHOOK_SECRET;
  delete process.env.APPWRITE_ENDPOINT;
  delete process.env.APPWRITE_PROJECT_ID;
  delete process.env.APPWRITE_API_KEY;
  delete process.env.APPWRITE_DATABASE_ID;
});

test("checkout.session.completed creates subscription if missing", async () => {
  const { admin, store } = memoryAdmin();
  setAdminContextFactoryForTests(() => admin as never);
  process.env.STRIPE_SECRET_KEY = "sk_test";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.APPWRITE_ENDPOINT = "https://example.com";
  process.env.APPWRITE_PROJECT_ID = "p";
  process.env.APPWRITE_API_KEY = "k";
  process.env.APPWRITE_DATABASE_ID = "db";

  const { payload, signature } = signedEvent("evt_1", "checkout.session.completed", {
    id: "cs_1",
    object: "checkout.session",
    subscription: "sub_1",
    customer: "cus_1",
    metadata: { tenant_id: "tenant_1", plan_code: "premium" },
  });

  const response = await runNamedHandler("stripe-webhook", {
    req: { headers: { "stripe-signature": signature }, body: payload },
  });

  assert.equal(response.statusCode, 200);
  const subscription = store[collectionIds.subscriptions][0];
  assert.ok(subscription, "Subscription should be created");
  assert.equal(subscription.tenant_id, "tenant_1");
  assert.equal(subscription.plan_code, "premium");
  assert.equal(subscription.status, "active");
  assert.equal(subscription.stripe_subscription_id, "sub_1");

  const entitlements = store[collectionIds.tenantEntitlements];
  assert.ok(entitlements.some(e => e.entitlement_key === "membership" && e.enabled === true));
});

test("webhook resolves tenant from customer ID fallback", async () => {
  const { admin, store } = memoryAdmin({
    [collectionIds.stripeCustomers]: [
      { $id: "cust_rec_1", tenant_id: "tenant_fallback", stripe_customer_id: "cus_999" }
    ]
  });
  setAdminContextFactoryForTests(() => admin as never);
  process.env.STRIPE_SECRET_KEY = "sk_test";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.APPWRITE_ENDPOINT = "https://example.com";
  process.env.APPWRITE_PROJECT_ID = "p";
  process.env.APPWRITE_API_KEY = "k";
  process.env.APPWRITE_DATABASE_ID = "db";

  // No metadata in this event
  const { payload, signature } = signedEvent("evt_2", "checkout.session.completed", {
    id: "cs_2",
    object: "checkout.session",
    subscription: "sub_2",
    customer: "cus_999",
    metadata: {},
  });

  const response = await runNamedHandler("stripe-webhook", {
    req: { headers: { "stripe-signature": signature }, body: payload },
  });

  assert.equal(response.statusCode, 200);
  const subscription = store[collectionIds.subscriptions][0];
  assert.equal(subscription.tenant_id, "tenant_fallback");
  assert.equal(subscription.stripe_subscription_id, "sub_2");
});

test("webhook resolves tenant from existing subscription fallback", async () => {
  const { admin, store } = memoryAdmin({
    [collectionIds.subscriptions]: [
      { $id: "sub_rec_1", tenant_id: "tenant_sub_fallback", stripe_subscription_id: "sub_888", plan_code: "premium", status: "pending" }
    ]
  });
  setAdminContextFactoryForTests(() => admin as never);
  process.env.STRIPE_SECRET_KEY = "sk_test";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.APPWRITE_ENDPOINT = "https://example.com";
  process.env.APPWRITE_PROJECT_ID = "p";
  process.env.APPWRITE_API_KEY = "k";
  process.env.APPWRITE_DATABASE_ID = "db";

  // Subscription event, no metadata
  const { payload, signature } = signedEvent("evt_3", "customer.subscription.updated", {
    id: "sub_888",
    object: "subscription",
    status: "active",
    metadata: {},
  });

  const response = await runNamedHandler("stripe-webhook", {
    req: { headers: { "stripe-signature": signature }, body: payload },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(store[collectionIds.subscriptions][0].status, "active");
  assert.equal(store[collectionIds.subscriptions][0].tenant_id, "tenant_sub_fallback");
});
