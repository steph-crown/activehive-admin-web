import { formatMoneyDisplayAsNgn, formatNgn } from "@/lib/format-ngn";

import type { Gym } from "../types";

const PLAN_KEYS = ["basic", "pro", "enterprise", "trial"] as const;
const PLAN_LABELS: Record<(typeof PLAN_KEYS)[number], string> = {
  basic: "Basic",
  pro: "Pro",
  enterprise: "Enterprise",
  trial: "Trial",
};

function stableHash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Placeholder monthly revenue when the API omits `revenue` (matches list row logic). */
export function formatGymRevenueFallbackForId(gymId: string): string {
  const h = stableHash(gymId);
  return formatNgn(((h % 420) + 12) * 1000);
}

function normalizePlanKey(
  api: string | null | undefined,
  fallbackIdx: number,
): (typeof PLAN_KEYS)[number] {
  if (api && String(api).trim()) {
    const l = String(api).toLowerCase();
    if (l.includes("basic")) return "basic";
    if (l.includes("pro")) return "pro";
    if (l.includes("enterprise")) return "enterprise";
    if (l.includes("trial")) return "trial";
  }
  return PLAN_KEYS[fallbackIdx % PLAN_KEYS.length]!;
}

/** Row shape for the gyms list table and filters (includes display fallbacks when API omits fields). */
export type GymListRow = Gym & {
  displayMemberTotal: number;
  displayMemberActive: number;
  displayPlanKey: (typeof PLAN_KEYS)[number];
  displayPlanLabel: string;
  displayRevenue: string;
};

export function toGymListRow(gym: Gym): GymListRow {
  const h = stableHash(gym.id);
  const fromApiTotal =
    typeof gym.memberCount === "number" ? gym.memberCount : null;
  const fromApiActive =
    typeof gym.activeMemberCount === "number" ? gym.activeMemberCount : null;

  let displayMemberTotal =
    fromApiTotal ?? (h % 220) + (h % 4 === 0 ? 0 : 1);
  let displayMemberActive =
    fromApiActive ??
    Math.floor((displayMemberTotal * ((h % 70) + 30)) / 100);
  if (displayMemberActive > displayMemberTotal) {
    displayMemberActive = displayMemberTotal;
  }

  const displayPlanKey = normalizePlanKey(gym.subscriptionPlanName, h);
  const displayPlanLabel = PLAN_LABELS[displayPlanKey];

  const displayRevenue =
    gym.revenue && String(gym.revenue).trim()
      ? formatMoneyDisplayAsNgn(gym.revenue)
      : formatGymRevenueFallbackForId(gym.id);

  return {
    ...gym,
    displayMemberTotal,
    displayMemberActive,
    displayPlanKey,
    displayPlanLabel,
    displayRevenue,
  };
}

export const GYM_PLAN_FILTER_OPTIONS = [
  { value: "all", label: "All plans" },
  { value: "basic", label: PLAN_LABELS.basic },
  { value: "pro", label: PLAN_LABELS.pro },
  { value: "enterprise", label: PLAN_LABELS.enterprise },
  { value: "trial", label: PLAN_LABELS.trial },
];
