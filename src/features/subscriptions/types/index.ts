import type { GymAddress } from "@/features/gyms/types";

export type SubscriptionGymOwner = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  [key: string]: unknown;
};

export type SubscriptionGym = {
  id: string;
  name: string;
  address: GymAddress | null;
  [key: string]: unknown;
};

export type Subscription = {
  id: string;
  gymOwnerId: string;
  gymId: string;
  plan: string;
  status: string;
  monthlyPrice: number | null;
  trialStartDate: string | null;
  trialEndDate: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  lastPaymentDate: string | null;
  nextPaymentDate: string | null;
  autoRenew: boolean;
  cancellationDate: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  gymOwner: SubscriptionGymOwner | null;
  gym: SubscriptionGym | null;
};
