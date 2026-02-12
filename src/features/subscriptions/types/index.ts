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
  trainerId: string | null;
  gymId: string;
  platformPlanId?: string | null;
  plan: string | null;
  status: string;
  monthlyPrice: string | null;
  trialStartDate: string | null;
  trialEndDate: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  lastPaymentDate: string | null;
  nextPaymentDate: string | null;
  autoRenew: boolean;
  cancellationDate: string | null;
  cancellationReason: string | null;
  subscribedBy?: string | null;
  isTrial?: boolean;
  createdAt: string;
  updatedAt: string;
  gymOwner: SubscriptionGymOwner | null;
  gym: SubscriptionGym | null;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  planType: "gym_owner" | "trainer";
  price: string;
  billingPeriod: string;
  features: string[] | null;
  trialDays: number | null;
  isActive: boolean;
  isDefault: boolean;
  isPopular: boolean;
  sortOrder: number | null;
};
