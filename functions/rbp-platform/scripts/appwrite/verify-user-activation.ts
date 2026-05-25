import { createAdminContext, collectionIds } from "./appwriteAdmin.js";
import { Query } from "node-appwrite";

const identifier = process.argv[2];

if (!identifier) {
  console.error("Usage: node scripts/appwrite/verify-user-activation.ts <email|user_id|tenant_id>");
  process.exit(1);
}

async function verify() {
  const admin = createAdminContext();
  let userProfile = null;
  let tenantId = "";

  // 1. Resolve User & Tenant
  if (identifier.includes("@")) {
    userProfile = await admin.findOne(collectionIds.userProfiles, [Query.equal("email", [identifier.toLowerCase()])]);
  } else if (identifier.startsWith("id_") || identifier.length > 20) {
    // Try user ID first
    userProfile = await admin.findOne(collectionIds.userProfiles, [Query.equal("appwrite_user_id", [identifier])]);
    if (!userProfile) {
      // Try tenant ID
      const tenant = await admin.getDocument(collectionIds.tenants, identifier).catch(() => null);
      if (tenant) {
        tenantId = identifier;
        userProfile = await admin.findOne(collectionIds.userProfiles, [Query.equal("tenant_id", [tenantId])]);
      }
    }
  }

  if (userProfile) {
    tenantId = userProfile.tenant_id;
  }

  if (!tenantId) {
    console.error(`Could not resolve tenant for identifier: ${identifier}`);
    process.exit(1);
  }

  const tenant = await admin.getDocument(collectionIds.tenants, tenantId);
  const subscription = await admin.findOne(collectionIds.subscriptions, [Query.equal("tenant_id", [tenantId])]);
  const customer = await admin.findOne(collectionIds.stripeCustomers, [Query.equal("tenant_id", [tenantId])]);
  const payments = await admin.listDocuments(collectionIds.paymentEvents, [Query.equal("tenant_id", [tenantId]), Query.orderDesc("$createdAt"), Query.limit(5)]);
  const entitlements = await admin.listDocuments(collectionIds.tenantEntitlements, [Query.equal("tenant_id", [tenantId])]);
  const audit = await admin.listDocuments(collectionIds.auditEvents, [Query.equal("tenant_id", [tenantId]), Query.orderDesc("$createdAt"), Query.limit(1)]);

  const report = {
    user: {
      id: userProfile?.appwrite_user_id,
      email: userProfile?.email,
      role: userProfile?.role,
    },
    tenant: {
      id: tenantId,
      name: tenant.tenant_name,
    },
    stripe: {
      customer_id: customer?.stripe_customer_id,
      subscription_id: subscription?.stripe_subscription_id,
    },
    membership: {
      plan_code: subscription?.plan_code || tenant.plan_code,
      status: subscription?.status || "none",
    },
    activation: {
      payment_events_count: payments.total,
      latest_event: payments.documents[0]?.event_type,
      latest_event_status: payments.documents[0]?.status,
      entitlements_count: entitlements.total,
      premium_active: entitlements.documents.some(e => e.entitlement_key === "membership" && e.enabled === true),
      latest_audit: audit.documents[0]?.event_name,
    }
  };

  console.log(JSON.stringify(report, null, 2));
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
