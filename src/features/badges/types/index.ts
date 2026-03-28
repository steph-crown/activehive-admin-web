export type BadgeCategory =
  | "streak"
  | "milestone"
  | "social"
  | "achievement";

export type BadgeStatus = "active" | "inactive";

export type PlatformBadge = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  /** Internal automation / review notes (optional). */
  criteria?: string | null;
  category: BadgeCategory;
  points: number;
  status: BadgeStatus;
  createdAt: string;
};

export type CreateBadgePayload = {
  name: string;
  slug: string;
  description: string | null;
  category: BadgeCategory;
  points: number;
  criteria: string | null;
};
