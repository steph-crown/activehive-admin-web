import type { ChallengeStatus, ChallengeType } from "../types";

export const challengeTypeLabel: Record<ChallengeType, string> = {
  fitness: "Fitness",
  weight_loss: "Weight loss",
  attendance: "Attendance",
  steps: "Steps",
  custom: "Custom",
};

export function challengeDurationLabel(days: number): string {
  if (days === 0) return "Same day";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export function formatChallengeSchedule(
  startDate: string,
  endDate: string,
): string {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const a = new Date(`${startDate}T12:00:00`).toLocaleDateString(undefined, opts);
  const b = new Date(`${endDate}T12:00:00`).toLocaleDateString(undefined, opts);
  return `${a} – ${b}`;
}

export function challengeStatusBadgeVariant(
  status: ChallengeStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "active":
      return "default";
    case "draft":
      return "outline";
    case "completed":
    case "archived":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}
