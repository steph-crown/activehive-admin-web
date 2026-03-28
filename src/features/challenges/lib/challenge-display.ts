import type { ChallengeStatus, ChallengeType } from "../types";

export const challengeTypeLabel: Record<ChallengeType, string> = {
  workout_streak: "Workout streak",
  check_in: "Check-in",
  steps: "Steps",
  referral: "Referral",
};

export function challengeDurationLabel(
  startsAt: string,
  endsAt: string,
): string {
  const ms = new Date(endsAt).getTime() - new Date(startsAt).getTime();
  const days = Math.max(0, Math.round(ms / 86_400_000));
  if (days === 0) return "Same day";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export function formatChallengeSchedule(startsAt: string, endsAt: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const a = new Date(startsAt).toLocaleDateString(undefined, opts);
  const b = new Date(endsAt).toLocaleDateString(undefined, opts);
  return `${a} – ${b}`;
}

export function challengeStatusBadgeVariant(
  status: ChallengeStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "active":
      return "default";
    case "scheduled":
      return "secondary";
    case "draft":
      return "outline";
    case "completed":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}
