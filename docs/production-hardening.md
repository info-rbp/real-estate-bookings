# Production Hardening Plan

## 1) Work order creation
- **Current risk:** Frontend still controls parts of request payload and timing.
- **Recommended approach:** Route all creation through an Appwrite Function that validates permissible fields and derives server-side defaults.
- **Priority:** P0
- **Acceptance criteria:** Client cannot create/override protected fields; function enforces schema and status transitions.

## 2) Pricing calculation
- **Current risk:** Client-side pricing can be tampered with before submission.
- **Recommended approach:** Calculate pricing in a server-side Function using trusted rate-card data.
- **Priority:** P0
- **Acceptance criteria:** Server returns authoritative totals; frontend displays but cannot set totals.

## 3) Access issue fee creation
- **Current risk:** Fee math currently available from client-side flow.
- **Recommended approach:** Move fee derivation and eligibility checks into a Function.
- **Priority:** P1
- **Acceptance criteria:** Fee amount derived server-side and logged with actor/action context.

## 4) Work order status changes
- **Current risk:** Browser-side updates risk invalid transitions.
- **Recommended approach:** Status transition Function with role + transition matrix checks.
- **Priority:** P0
- **Acceptance criteria:** Invalid transitions rejected; approved transitions recorded with audit trail.

## 5) Regional batch assignment
- **Current risk:** Assignment/count mutations happen client-side.
- **Recommended approach:** Function handles atomic assignment and batch counters.
- **Priority:** P1
- **Acceptance criteria:** No direct client writes for assignment/counters; conflict-safe updates.

## 6) Invoice generation/export
- **Current risk:** Generation triggers from frontend; filter/scope validation must remain server-side.
- **Recommended approach:** Keep generation in Function with scoped payload validation; export should read least-privilege dataset.
- **Priority:** P0
- **Acceptance criteria:** Function accepts validated scope/date/client inputs and updates source work orders atomically.

## 7) Admin reporting
- **Current risk:** Broad client-readable collections may leak data if permissions are loose.
- **Recommended approach:** Use role-gated Functions for aggregate reports.
- **Priority:** P1
- **Acceptance criteria:** Admin reports only available through server-verified role checks.

## 8) Appwrite permissions review
- **Current risk:** Overly permissive collection rules can bypass app checks.
- **Recommended approach:** Least-privilege ACL review per collection and function key scope review.
- **Priority:** P0
- **Acceptance criteria:** Documented ACL matrix; write access narrowed to required actors/services.

## 9) Audit logging
- **Current risk:** Not all sensitive actions are guaranteed to emit audit records.
- **Recommended approach:** Centralize audit emission in Functions for sensitive mutations.
- **Priority:** P1
- **Acceptance criteria:** Required actions produce consistent actor/action/entity metadata.

## 10) Stripe/payment hardening (if active)
- **Current risk:** Client-triggered payment setup paths may be abused if webhook/state validation is weak.
- **Recommended approach:** Server-side checkout session creation + strict webhook signature verification and idempotency.
- **Priority:** P1
- **Acceptance criteria:** Payment state only changes via verified webhook/function paths.
