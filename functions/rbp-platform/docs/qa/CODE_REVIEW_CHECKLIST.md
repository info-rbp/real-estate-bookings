# RBP Code Review Plan

This document defines the mandatory code review process for the Remote Business Partner (RBP) Platform to ensure stability, security, and consistent functionality during the Appwrite transition.

## Automated Verification (CI/CD)

Every pull request MUST pass the following automated checks before human review:

1. **Frontend Build:** `cd frontend/portal && npm run build`
   - Ensures no broken imports or type errors.
2. **Unit Tests:** `npm run test:unit`
   - Validates backend logic, config sanitization, and schema integrity.
3. **Integration Tests:** `npm run test:integration`
   - Validates Appwrite function runtime behavior, security boundaries, and Stripe webhook logic using memory mocks.
4. **Smoke Check Dry-Run:** `npm run test:smoke:dry-run`
   - Ensures deployment scripts and smoke tests have clear prerequisite validation.

## Manual Review Checklist

Reviewers must verify the following items for every change:

### 1. Structural Integrity
- [ ] No duplicate imports or overlapping function definitions (especially in `runtime.ts`).
- [ ] Shared constants/types are moved to dedicated modules (e.g., `portalServicesModel.ts`) instead of creating circular dependencies.
- [ ] No "dead code" or interrupted function logic remains in the source.

### 2. Security & Permissions
- [ ] **Admin Boundary:** All privileged actions are protected by `requireAdmin(context)`.
- [ ] **Customer Scope:** User-facing actions (e.g., `list_my_notifications`) strictly validate `currentUser` and `tenantId` context.
- [ ] **Bootstrap Rules:** Tenant bootstrapping hardcodes roles to `owner`/`member` and ignores client-provided roles.
- [ ] **Secrets:** No real secrets (Stripe keys, Appwrite keys) are committed to the repository.

### 3. Stripe & Payments
- [ ] **Redirect URLs:** Stripe Success/Cancel URLs point to the canonical branch alias or production domain, not immutable preview hashes.
- [ ] **Idempotency:** Webhook handlers check for existing `stripe_event_id` before processing to prevent duplicate entitlements.
- [ ] **Mode Check:** QA scripts and seeds use `price_test_` and `sk_test_` keys only.

### 4. Environment Consistency
- [ ] `.env.example` and `.env.qa.example` are updated if new variables are introduced.
- [ ] Build flags (e.g., `VITE_ENABLE_STRIPE_CHECKOUT`) match the intended environment behavior.

## Deployment Gates

Before promoting to the `qa` or `main` branches:

1. [ ] Run `npm run appwrite:schema:validate` to ensure repo-to-live schema alignment.
2. [ ] Run `npm run appwrite:functions:validate` to ensure all handlers are correctly defined.
3. [ ] Execute a live Premium Checkout test in the QA environment using a test card (4242...).
4. [ ] Verify that the post-payment redirect lands on the `/membership/confirmation` page with a valid session ID.
