import assert from "node:assert/strict";
import test from "node:test";

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

function createMemoryAdmin(seed: Partial<Store> = {}, adminUserIds: string[] = []) {
  const store: Store = {
    [collectionIds.tenants]: [],
    [collectionIds.businessProfiles]: [],
    [collectionIds.userProfiles]: [],
    [collectionIds.teamMemberships]: [],
    [collectionIds.membershipPlans]: [],
    [collectionIds.planEntitlements]: [],
    [collectionIds.subscriptions]: [],
    [collectionIds.tenantEntitlements]: [],
    [collectionIds.paymentEvents]: [],
    [collectionIds.auditEvents]: [],
    [collectionIds.notifications]: [],
    [collectionIds.notificationDeliveries]: [],
    [collectionIds.serviceRequests]: [],
    [collectionIds.applications]: [],
    [collectionIds.applicationInterest]: [],
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
    teams: {
      async listMemberships() {
        return {
          memberships: adminUserIds.map((userId) => ({ userId })),
        };
      },
    },
    async listDocuments(collectionId: string, queries: string[] = []) {
      return { documents: ensure(collectionId).filter((document) => matches(document, queries)) };
    },
    async getDocument(collectionId: string, documentId: string) {
      const document = ensure(collectionId).find((entry) => entry.$id === documentId);
      if (!document) throw new Error(`Missing ${collectionId}:${documentId}`);
      return document;
    },
    async createDocument(collectionId: string, data: Record<string, unknown>) {
      const $id = `id_${++sequence}`;
      const doc = { ...data, $id } as Document;
      ensure(collectionId).push(doc);
      return doc;
    },
    async updateDocument(collectionId: string, documentId: string, data: Record<string, unknown>) {
      const index = ensure(collectionId).findIndex((entry) => entry.$id === documentId);
      if (index === -1) throw new Error(`Not found ${collectionId}:${documentId}`);
      store[collectionId][index] = { ...store[collectionId][index], ...data };
      return store[collectionId][index];
    },
    async findOne(collectionId: string, queries: string[]) {
      return ensure(collectionId).find((document) => matches(document, queries)) || null;
    },
    async upsertByQuery(collectionId: string, queries: string[], data: Record<string, unknown>) {
      const existing = await this.findOne(collectionId, queries);
      if (existing) {
        return {
          operation: "updated",
          document: await this.updateDocument(collectionId, existing.$id, data),
        };
      }
      return {
        operation: "created",
        document: await this.createDocument(collectionId, data),
      };
    },
  };

  return { admin, store };
}

test.afterEach(() => {
  setAdminContextFactoryForTests(null);
  delete process.env.APPWRITE_ADMIN_TEAM_ID;
  delete process.env.APPWRITE_TRUSTED_FUNCTION_TOKEN;
  delete process.env.QA_EMAIL_ALLOWLIST;
  delete process.env.APPWRITE_ENDPOINT;
  delete process.env.APPWRITE_PROJECT_ID;
  delete process.env.APPWRITE_API_KEY;
  delete process.env.APPWRITE_DATABASE_ID;
});

test("unknown handlers are rejected clearly", async () => {
  const response = await runNamedHandler("unknown-test-handler", {});
  assert.equal(response.statusCode, 404);
  assert.match(response.body, /Unknown function handler/);
});

test("invalid JSON payloads fail clearly", async () => {
  const response = await runNamedHandler("bootstrap-tenant", {
    req: { body: "--- not json ---" },
  });
  assert.equal(response.statusCode, 500);
});

test("missing runtime configuration surfaces actionable errors", async () => {
  delete process.env.APPWRITE_ENDPOINT;
  const response = await runNamedHandler("bootstrap-tenant", {
    req: { body: "{}" },
  });
  assert.equal(response.statusCode, 500);
  assert.match(response.body, /Missing required runtime config: APPWRITE_ENDPOINT/);
});

test("public tenant bootstrap ignores client admin role", async () => {
  const { admin, store } = createMemoryAdmin();
  setAdminContextFactoryForTests(() => admin as never);
  process.env.APPWRITE_ENDPOINT = "https://example.com";
  process.env.APPWRITE_PROJECT_ID = "project";
  process.env.APPWRITE_API_KEY = "key";
  process.env.APPWRITE_DATABASE_ID = "db";

  const response = await runNamedHandler("bootstrap-tenant", {
    req: {
      headers: { "x-appwrite-user-id": "user_1" },
      body: JSON.stringify({ email: "test@example.com", name: "Tester", role: "admin" }),
    },
  });

  assert.equal(response.statusCode, 200);
  const profile = store[collectionIds.userProfiles][0];
  assert.equal(profile.role, "owner");
});

test("payload role cannot grant admin access", async () => {
  const { admin } = createMemoryAdmin({
    [collectionIds.userProfiles]: [
      { $id: "profile_1", tenant_id: "tenant_1", appwrite_user_id: "user_admin_payload", email: "u@example.com", role: "admin" },
    ],
  }, []); // Pass empty array for adminUserIds to ensure team membership check fails
  process.env.APPWRITE_ADMIN_TEAM_ID = "admins";
  setAdminContextFactoryForTests(() => admin as never);

  const response = await runNamedHandler("admin-operations", {
    req: {
      headers: { "x-appwrite-user-id": "user_admin_payload" },
      body: JSON.stringify({ action: "list_tenants" }),
    },
  });

  assert.equal(response.statusCode, 403);
});

test("duplicate business names create distinct tenants for unrelated users", async () => {
  const { admin, store } = createMemoryAdmin();
  setAdminContextFactoryForTests(() => admin as never);
  process.env.APPWRITE_ENDPOINT = "https://example.com";
  process.env.APPWRITE_PROJECT_ID = "project";
  process.env.APPWRITE_API_KEY = "key";
  process.env.APPWRITE_DATABASE_ID = "db";

  // User 1 bootstraps
  await runNamedHandler("bootstrap-tenant", {
    req: {
      headers: { "x-appwrite-user-id": "user_1" },
      body: JSON.stringify({ email: "u1@example.com", name: "U1", businessName: "Same Business" }),
    },
  });

  // User 2 bootstraps with same business name
  await runNamedHandler("bootstrap-tenant", {
    req: {
      headers: { "x-appwrite-user-id": "user_2" },
      body: JSON.stringify({ email: "u2@example.com", name: "U2", businessName: "Same Business" }),
    },
  });

  assert.equal(store[collectionIds.tenants].length, 2);
  assert.notEqual(store[collectionIds.userProfiles][0].tenant_id, store[collectionIds.userProfiles][1].tenant_id);
});

test("admin operations require Appwrite admin team membership or trusted internal invocation", async () => {
  const { admin: unauthorizedAdmin } = createMemoryAdmin({
    [collectionIds.userProfiles]: [{ $id: "p1", tenant_id: "t1", appwrite_user_id: "u1", role: "member" }],
  });
  setAdminContextFactoryForTests(() => unauthorizedAdmin as never);

  const failResponse = await runNamedHandler("admin-operations", {
    req: { headers: { "x-appwrite-user-id": "u1" }, body: JSON.stringify({ action: "list_tenants" }) },
  });
  assert.equal(failResponse.statusCode, 403);

  const { admin: authorizedAdmin } = createMemoryAdmin({
    [collectionIds.userProfiles]: [{ $id: "p2", tenant_id: "t2", appwrite_user_id: "u2", role: "admin" }],
  }, ["u2"]); // "u2" is in the admin team
  process.env.APPWRITE_ADMIN_TEAM_ID = "admins";
  setAdminContextFactoryForTests(() => authorizedAdmin as never);

  const okResponse = await runNamedHandler("admin-operations", {
    req: { headers: { "x-appwrite-user-id": "u2" }, body: JSON.stringify({ action: "list_tenants" }) },
  });
  assert.equal(okResponse.statusCode, 200);

  process.env.APPWRITE_TRUSTED_FUNCTION_TOKEN = "trusted-secret";
  const trustedResponse = await runNamedHandler("admin-operations", {
    req: {
      headers: { "x-rbp-trusted-invocation": "trusted-secret" },
      body: JSON.stringify({ action: "list_tenants" }),
    },
  });
  assert.equal(trustedResponse.statusCode, 200);
});

test("customer notification actions are scoped to user and tenant", async () => {
  const { admin, store } = createMemoryAdmin({
    [collectionIds.userProfiles]: [
      { $id: "p1", tenant_id: "t1", appwrite_user_id: "u1", role: "member" },
      { $id: "p2", tenant_id: "t2", appwrite_user_id: "u2", role: "member" },
    ],
    [collectionIds.notifications]: [
      { $id: "n1", tenant_id: "t1", user_id: "u1", title: "U1 Private" },
      { $id: "n2", tenant_id: "t1", user_id: "", title: "T1 Broad" },
      { $id: "n3", tenant_id: "t2", user_id: "u2", title: "U2 Private" },
    ],
  });
  setAdminContextFactoryForTests(() => admin as never);
  process.env.APPWRITE_ENDPOINT = "https://example.com";
  process.env.APPWRITE_PROJECT_ID = "project";
  process.env.APPWRITE_API_KEY = "key";
  process.env.APPWRITE_DATABASE_ID = "db";

  const response = await runNamedHandler("admin-operations", {
    req: {
      headers: { "x-appwrite-user-id": "u1" },
      body: JSON.stringify({ action: "list_my_notifications" }),
    },
  });

  const data = JSON.parse(response.body).data;
  assert.equal(data.items.length, 2);
  assert.ok(data.items.some(n => n.title === "U1 Private"));
  assert.ok(data.items.some(n => n.title === "T1 Broad"));
  assert.ok(!data.items.some(n => n.title === "U2 Private"));
});
