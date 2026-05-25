import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";

import { ConfirmationPanel } from "../../components/flow";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { StatusBadge } from "../../components/status";
import { membershipFlowStorageKey } from "../../features/membership/MembershipPurchaseOnboardingFlow";
import { appwriteBillingApi } from "../../services/api/appwrite/appwriteBillingApi";

interface StoredMembershipConfirmation {
  signupReference?: string;
  onboardingReference?: string;
  membershipTier?: "free" | "premium";
  membershipStatus?: string;
  paymentStatus?: string;
  onboardingStatus?: string;
  portalHref?: string;
  businessName?: string;
  primaryContactName?: string;
  selectedPlan?: string;
  returnTo?: string;
}

function readStoredConfirmation(): StoredMembershipConfirmation | null {
  const rawValue = window.sessionStorage.getItem(membershipFlowStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredMembershipConfirmation;
  } catch {
    return null;
  }
}

function formatLifecycleStatus(status: string | undefined, fallback: string) {
  return status ? status.replace(/-/g, " ") : fallback;
}

function formatPaymentStatus(status: string | undefined, membershipTier?: "free" | "premium") {
  if (membershipTier === "free" || status === "not-required") {
    return "No payment required";
  }

  if (status === "active" || status === "paid" || status === "complete") {
    return "Payment successful";
  }

  if (status === "preview-complete" || status === "simulated-success") {
    return "Payment preview complete";
  }

  if (status === "simulated-failed") {
    return "Payment preview failed";
  }

  if (status === "pending") {
    return "Payment pending verification";
  }

  return status ? status.replace(/-/g, " ") : "not started";
}

export function MembershipConfirmationPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [realStatus, setRealStatus] = useState<any>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [retryCount, setRetryCount] = useState(0);

  const confirmation = readStoredConfirmation();

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const response = await appwriteBillingApi.getSubscriptionStatus();
        if (!isMounted) return;

        if (response && response.subscription) {
          setRealStatus(response);
          if (response.subscription.status === "active") {
            setLoading(false);
            return;
          }
        }

        // Retry if still pending/none up to 10 times (60s roughly with interval)
        if (retryCount < 10) {
          setTimeout(() => {
            if (isMounted) setRetryCount(prev => prev + 1);
          }, 6000);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to poll subscription status:", err);
        if (retryCount >= 10) setLoading(false);
      }
    };

    fetchStatus();
    return () => { isMounted = false; };
  }, [sessionId, retryCount]);

  const activeSubscription = realStatus?.subscription;
  const isPremium = activeSubscription?.plan_code === "premium" && activeSubscription?.status === "active";
  const isFree = confirmation?.membershipTier === "free" && !isPremium;

  const primaryReference = sessionId
    ? (activeSubscription?.$id ?? "STRIPE-CHECKOUT-VERIFYING")
    : (confirmation?.onboardingReference ?? confirmation?.signupReference ?? "MEM-PREVIEW-001");

  const title = isPremium
    ? "RBP Premium Membership Activated"
    : isFree
      ? "RBP Free Membership Activated"
      : loading
        ? "Verifying Premium Activation..."
        : "Membership Status Confirmed";

  const message = isPremium
    ? "Your Premium Membership is now active. You have full access to RBP marketplace benefits, discounted services, and member-only resources."
    : isFree
      ? "Your Free Membership has been activated. You can now continue to onboarding, purchase products and services online, and manage your basic member profile."
      : loading
        ? "We are verifying your payment and activating your premium benefits. This usually takes a few seconds."
        : "Your membership request has been recorded. If you just completed a payment, it may take a minute to reflect in your dashboard.";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <ConfirmationPanel
            title={title}
            statusLabel={formatPaymentStatus(activeSubscription?.status || confirmation?.paymentStatus, isPremium ? "premium" : (isFree ? "free" : undefined))}
            message={message}
            reference={primaryReference}
            primaryAction={
              <Link
                to={confirmation?.portalHref ?? "/portal/dashboard"}
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Go to portal dashboard
              </Link>
            }
            secondaryAction={
              <Link
                to={
                  isPremium
                    ? "/membership/inclusions"
                    : isFree
                      ? confirmation?.returnTo || "/marketplace"
                      : "/membership/overview"
                }
                className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700"
              >
                {isPremium ? "View Premium Inclusions" : (isFree ? "Browse Marketplace" : "View Membership Options")}
              </Link>
            }
          />

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Membership status summary</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge
                status={activeSubscription?.status || confirmation?.membershipStatus || "pending"}
                label={`Membership: ${formatLifecycleStatus(activeSubscription?.status || confirmation?.membershipStatus, "pending")}`}
              />
              <StatusBadge
                status={activeSubscription?.status || confirmation?.paymentStatus || "pending"}
                label={`Payment: ${formatPaymentStatus(activeSubscription?.status || confirmation?.paymentStatus, isPremium ? "premium" : (isFree ? "free" : undefined))}`}
              />
              <StatusBadge
                status={confirmation?.onboardingStatus ?? "not-started"}
                label={`Onboarding: ${formatLifecycleStatus(confirmation?.onboardingStatus, "not started")}`}
              />
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-500">Business</dt>
                <dd className="mt-1 text-slate-900">{confirmation?.businessName ?? "Registered Business"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Contact</dt>
                <dd className="mt-1 text-slate-900">{confirmation?.primaryContactName ?? "Primary Member"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Plan</dt>
                <dd className="mt-1 text-slate-900">
                  {activeSubscription?.plan_code === "premium" ? "RBP Premium Membership" : "RBP Free Membership"}
                </dd>
              </div>
              {sessionId && (
                <div>
                  <dt className="font-semibold text-slate-500">Checkout Session</dt>
                  <dd className="mt-1 text-xs text-slate-500 truncate">{sessionId}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
