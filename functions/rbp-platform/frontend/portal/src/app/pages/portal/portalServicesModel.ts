export type ServiceStatus = "Active" | "In Progress" | "Requested" | "Outcome Ready" | "Completed" | "Available";

export interface Service {
  id: string;
  title: string;
  category: string;
  status: ServiceStatus;
  description: string;
  lastUpdated: string;
  nextAction: string;
  buttonLabel: string;
  icon: React.ElementType;
}

import {
  Zap,
  FileText,
  Wifi,
  ShieldAlert,
  Wrench,
  BarChart2,
  Calculator,
  Tag,
  CheckCircle,
} from "lucide-react";
import { mockPortalServiceRequests } from "../../mock";

function statusLabel(status: string): ServiceStatus {
  if (status === "in-review" || status === "in-progress") return "In Progress";
  if (status === "submitted" || status === "pending") return "Requested";
  if (status === "outcome-ready") return "Outcome Ready";
  if (status === "assigned" || status === "active") return "Active";
  if (status === "closed") return "Completed";
  return "Available";
}

const sourceIcon: Record<string, React.ElementType> = {
  "Decision Desk": Zap,
  DocuShare: FileText,
  Connectivity: Wifi,
  "Risk Advisor": ShieldAlert,
  "The Fixer": Wrench,
};

export const SERVICES: Service[] = [
  ...mockPortalServiceRequests.map((request) => ({
    id: request.id,
    title: request.source,
    category: request.category,
    status: statusLabel(request.status),
    description: request.description,
    lastUpdated: request.lastUpdated,
    nextAction: request.nextAction,
    buttonLabel: request.ctaLabel,
    icon: sourceIcon[request.source],
  })),
  {
    id: "business-health-snapshot",
    title: "Business Health Snapshot",
    category: "Advisory",
    status: "Active",
    description: "A structured review of growth, finance and operational priorities.",
    lastUpdated: "1 May 2026",
    nextAction: "View snapshot",
    buttonLabel: "Open",
    icon: BarChart2,
  },
  {
    id: "finance-calculator-pack",
    title: "Finance Calculator Pack",
    category: "Operations Tool",
    status: "Available",
    description: "Planning tools for lending, cash flow and business finance.",
    lastUpdated: "—",
    nextAction: "Activate when ready",
    buttonLabel: "Activate",
    icon: Calculator,
  },
  {
    id: "xero-partner-offer",
    title: "Xero Partner Offer",
    category: "Partner Offer",
    status: "Completed",
    description: "Partner offer activated through the RBP marketplace.",
    lastUpdated: "20 Apr 2026",
    nextAction: "Offer active",
    buttonLabel: "View Offer",
    icon: Tag,
  },
];
