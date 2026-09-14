import type { GymAddress } from "@/features/gyms/types";

export type SubscriptionGymOwner = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  [key: string]: unknown;
};

export type SubscriptionTrainer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
};

export type SubscriptionGym = {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  address: GymAddress | null;
  owner?: SubscriptionGymOwner | null;
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
  gracePeriodDays: number | null;
  gracePeriodEndDate: string | null;
  actualDeactivationDate: string | null;
  createdAt: string;
  updatedAt: string;
  gymOwner: SubscriptionGymOwner | null;
  trainer: SubscriptionTrainer | null;
  gym: SubscriptionGym | null;
  platformPlan: SubscriptionPlan | null;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  planType: "gym_owner" | "trainer";
  price: string;
  billingPeriod: string;
  features: string[] | null;
  featureFlags: string[] | null;
  maxStaff: number | null;
  maxLocations: number | null;
  maxClassesPerMonth: number | null;
  trialDays: number | null;
  isActive: boolean;
  isDefault: boolean;
  isPopular: boolean;
  sortOrder: number | null;
};

export type SubscriptionDetail = {
  gym: { id: string; name: string };
  owner: { id: string; name: string; email: string };
  status: string;
  plan: { id: string; name: string };
  pricing: { amount: string | number; currency: string; billingPeriod: string };
  trialStartDate: string | null;
  trialEndDate: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  nextPaymentDate: string | null;
  autoRenew: boolean;
  cancellationReason: string | null;
  cancelledAt: string | null;
};

export type SubscriptionRenewalHistory = {
  id: string;
  subscriptionId: string;
  previousPlanId: string | null;
  newPlanId: string | null;
  previousPlan: SubscriptionPlan | null;
  newPlan: SubscriptionPlan | null;
  previousStatus: string;
  newStatus: string;
  previousSubscriptionEndDate: string | null;
  newSubscriptionEndDate: string | null;
  amountPaid: number | null;
  promoCode: string | null;
  renewedBy: string | null;
  createdAt: string;
};
