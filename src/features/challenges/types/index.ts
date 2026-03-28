export type ChallengeType =
  | "workout_streak"
  | "check_in"
  | "steps"
  | "referral";

export type ChallengeStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "completed"
  | "cancelled";

export type PlatformChallenge = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: ChallengeType;
  status: ChallengeStatus;
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
