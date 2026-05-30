export type ChallengeType =
  | "fitness"
  | "weight_loss"
  | "attendance"
  | "steps"
  | "custom";

export type ChallengeStatus =
  | "draft"
  | "active"
  | "completed"
  | "cancelled"
  | "archived";

export type ChallengeSchedule = {
  startDate: string;
  endDate: string;
  durationDays: number;
};

export type ChallengeRewards = {
  points: number;
  badge?: string | null;
  description?: string | null;
};

/** Raw challenge entity from the API. */
export type ChallengeApi = {
  id: string;
  name: string;
  slug: string;
  type: ChallengeType;
  description?: string | null;
  status: ChallengeStatus;
  schedule: ChallengeSchedule;
  rewards: ChallengeRewards;
  gymId?: string | null;
  createdBy?: string | null;
  metadata?: Record<string, unknown> | null;
  participantCount?: number | null;
  completionCount?: number | null;
  createdAt?: string;
  updatedAt?: string;
  gym?: unknown | null;
  creator?: unknown | null;
};

export type PlatformChallenge = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: ChallengeType;
  status: ChallengeStatus;
  /** API schedule dates (`YYYY-MM-DD`). */
  startDate: string;
  endDate: string;
  durationDays: number;
  /** ISO timestamps derived from schedule — used by forms and edit guards. */
  startsAt: string;
  endsAt: string;
  rewardPoints: number;
  participantCount: number;
  createdAt: string;
};

export type CreateChallengePayload = {
  name: string;
  slug: string;
  description: string | null;
  type: ChallengeType;
  startsAt: string;
  endsAt: string;
  rewardPoints: number;
};

export type UpdateChallengePayload = CreateChallengePayload & {
  id: string;
  status: ChallengeStatus;
};

export type ApiChallengeWriteBody = {
  name: string;
  slug: string;
  type: ChallengeType;
  description: string;
  schedule: ChallengeSchedule;
  rewards: ChallengeRewards;
  gymId?: string;
  metadata?: Record<string, unknown>;
  status?: ChallengeStatus;
};
