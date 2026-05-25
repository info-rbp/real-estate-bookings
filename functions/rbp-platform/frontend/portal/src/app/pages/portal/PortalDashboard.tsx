import { useEffect, useState } from "react";
import { Link } from "react-router";
import { PortalAdminReference } from "./PortalAdminReference";
import { PortalStatusCard } from "../../components/domain";
import { StatusBadge } from "../../components/status";
import { mockPortalDashboard } from "../../mock";
import { appwritePortalApi } from "../../services/api/appwrite/appwritePortalApi";
import {
  Zap, CalendarCheck, FileText, CheckCircle, Tag,
  Star, ArrowRight, ChevronRight, TrendingUp, Clock,
  Users, MessageSquare, AlertCircle, HeadphonesIcon,
  AppWindowIcon, Plus,
} from "lucide-react";

const metricIcon = {
  zap: Zap,
  alert: AlertCircle,
  file: FileText,
  check: CheckCircle,
};

const metricTone = {
  blue: { color: "bg-blue-50 text-blue-700", border: "border-blue-100" },
  amber: { color: "bg-amber-50 text-amber-700", border: "border-amber-100" },
  emerald: { color: "bg-emerald-50 text-emerald-700", border: "border-emerald-100" },
  violet: { color: "bg-violet-50 text-violet-700", border: "border-violet-100" },
};

const activityStatusColor: Record<string, string> = {
  "In review": "bg-amber-50 text-amber-700",
  "Outcome ready": "bg-emerald-50 text-emerald-700",
  Ready: "bg-emerald-50 text-emerald-700",
  Included: "bg-blue-50 text-blue-700",
};

const quickActionIcon = {
  plus: Plus,
  calendar: CalendarCheck,
  file: FileText,
  tag: Tag,
  app: AppWindowIcon,
  support: HeadphonesIcon,
};

const quickActionColor = {
  primary: "bg-blue-700 text-white hover:bg-blue-800",
  dark: "bg-slate-900 text-white hover:bg-slate-800",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
};

const upcomingSessions = [
  {
    title: "Monthly Strategy Session",
    date: "Tue 12 May 2026",
    time: "10:00 AM",
    consultant: "James R.",
    type: "Advisory",
  },
  {
    title: "Financial Planning Review",
    date: "Wed 20 May 2026",
    time: "2:00 PM",
    consultant: "Amanda K.",
    type: "Finance",
  },
];

const healthMetrics = [
  { label: "Revenue Growth", value: 72, color: "bg-blue-600" },
  { label: "Operational Efficiency", value: 58, color: "bg-violet-600" },
  { label: "Strategic Milestone Progress", value: 85, color: "bg-emerald-600" },
];

const CONSULTANT_ASSIGNED = true;

export function PortalDashboard() {
  const [portalState, setPortalState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    appwritePortalApi.getDashboardState().then((response) => {
      if (mounted) {
        if (response.ok && response.data) {
          setPortalState(response.data);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !portalState) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
      </div>
    );
  }

  const activePortalActivities = portalState.activities || [];
  const memberName = portalState.customer.name;
  const businessName = portalState.customer.businessName || "Your business";
  const isPremium = portalState.membershipPlan === "premium" && portalState.membershipStatus === "active";

  return (
    <div className="px-4 py-6 space-y-6 sm:px-6">
      <PortalAdminReference
        portalRoute="/portal/dashboard"
        controlledBy={["Admin Dashboard", "Admin Membership"]}
      />

      <PortalStatusCard
        title={isPremium ? "RBP Premium Membership" : "RBP Free Membership"}
        description={`${memberName} is viewing the authenticated portal for ${businessName}. Membership is ${portalState.membershipStatus}.`}
        status={portalState.membershipStatus === "active" ? "active" : "in-progress"}
        href="/portal/membership/checkout"
      />

      {activePortalActivities.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {activePortalActivities.slice(0, 3).map((activity) => (
            <PortalStatusCard
              key={activity.$id || activity.id}
              title={activity.reference_id ? `${activity.request_type} ${activity.reference_id}` : activity.title || activity.request_type}
              description={activity.summary || activity.description || "Active request"}
              status={activity.status}
              href={`/portal/services/${activity.$id || activity.id}`}
            />
          ))}
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl bg-blue-700 px-6 py-5">
        <div className="pointer-events-none absolute -top-8 -right-8 h-44 w-44 rounded-full bg-blue-600 opacity-40" />
        <div className="pointer-events-none absolute right-20 -bottom-10 h-32 w-32 rounded-full bg-blue-800 opacity-40" />

        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-100">
                Growth Partner Programme
              </span>
            </div>
            <h2 className="mb-1.5 text-xl font-extrabold text-white">Welcome back, {memberName}.</h2>
            <p className="max-w-lg text-sm text-blue-100">
              {businessName} has <span className="font-bold text-white">{activePortalActivities.length} product activities</span>,{" "}
              <span className="font-bold text-white">{(portalState.notifications || []).length} notifications</span>, and recommended next actions ready.
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <Link
              to="/portal/services"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 transition-all hover:bg-blue-50"
            >
              Open My Services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/portal/sessions"
              className="hidden items-center gap-1.5 rounded-xl bg-blue-600/50 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-600/70 sm:inline-flex"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {mockPortalDashboard.metrics.map((s) => {
          const Icon = metricIcon[s.icon];
          const tone = metricTone[s.tone];
          return (
            <Link
              key={s.id}
              to={s.href}
              className={`rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${tone.border}`}
            >
              <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-xl ${tone.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mb-0.5 text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="mb-0.5 text-xs font-semibold text-slate-700">{s.label}</div>
              <div className="text-[10px] text-slate-400">{s.sub}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
            <Link to="/portal/services" className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {activePortalActivities.slice(0, 8).map((item) => (
              <Link
                key={item.$id || item.id}
                to={`/portal/services/${item.$id || item.id}`}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    <Zap className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-slate-800">{item.reference_id || item.request_type}</div>
                    <div className="text-[10px] text-slate-400">{item.$updatedAt || item.updatedAt}</div>
                  </div>
                </div>
                <span className={`flex-shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${activityStatusColor[item.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Quick Actions</h3>
          </div>
          <div className="space-y-2 p-4">
            {mockPortalDashboard.quickLinks.map((action) => {
              const Icon = quickActionIcon[action.icon];
              return (
                <Link
                  key={action.id}
                  to={action.href}
                  className={`flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${quickActionColor[action.emphasis]}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    {action.label}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Notifications</h3>
          </div>
          {(portalState.notifications || []).length > 0 ? (
            <div className="divide-y divide-slate-50">
              {portalState.notifications.map((notification) => (
                <Link
                  key={notification.$id || notification.id}
                  to={notification.href ?? "/portal/dashboard"}
                  className="block px-5 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-slate-900">{notification.title}</p>
                    <StatusBadge status={notification.status} />
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">{notification.message}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <CheckCircle className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
              <p className="text-sm font-bold text-slate-700">No notifications</p>
              <p className="text-xs text-slate-400">You are all caught up.</p>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-extrabold text-slate-900">Recommended Next Actions</h3>
          </div>
          <div className="grid grid-cols-1 divide-slate-50 md:grid-cols-3 md:divide-x md:divide-y-0">
            {mockPortalDashboard.nextSteps.map((step) => (
              <Link key={step.id} to={step.href} className="p-5 transition-colors hover:bg-slate-50">
                <StatusBadge status={step.status} />
                <h4 className="mt-3 text-xs font-extrabold leading-snug text-slate-900">{step.title}</h4>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{step.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
