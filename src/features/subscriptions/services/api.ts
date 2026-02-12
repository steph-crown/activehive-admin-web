import { apiClient } from "@/lib/api-client";
import type { BillingPeriod } from "../constants";
import type { Subscription, SubscriptionPlan } from "../types";

const subscriptionsBasePath = "/api/admin/subscriptions";
const publicPlansPath = "/api/subscription-plans/active";
const adminPlansBasePath = "/api/admin/subscription-plans";

export type CreateSubscriptionPlanPayload = {
  name: string;
  description: string | null;
  planType: "gym_owner" | "trainer";
  price: number;
  billingPeriod: BillingPeriod;
  features: string[];
  trialDays: number | null;
  hasTrial: boolean;
  isActive: boolean;
  isDefault: boolean;
  isPopular: boolean;
  sortOrder: number | null;
};

export type UpdateSubscriptionPlanPayload = Partial<CreateSubscriptionPlanPayload>;

export const subscriptionsApi = {
  getSubscriptions: async (): Promise<Subscription[]> => {
    return await apiClient.get<Subscription[]>(subscriptionsBasePath);
  },
  getActivePlans: async (
    planType: "gym_owner" | "trainer",
  ): Promise<SubscriptionPlan[]> => {
    return await apiClient.get<SubscriptionPlan[]>(publicPlansPath, {
      params: { planType },
    });
  },
  createSubscriptionPlan: async (
    payload: CreateSubscriptionPlanPayload,
  ): Promise<SubscriptionPlan> => {
    return await apiClient.post<SubscriptionPlan>(adminPlansBasePath, payload);
  },
  getSubscriptionPlanById: async (id: string): Promise<SubscriptionPlan> => {
    return await apiClient.get<SubscriptionPlan>(`${adminPlansBasePath}/${id}`);
  },
  updateSubscriptionPlan: async (
    id: string,
    payload: UpdateSubscriptionPlanPayload,
  ): Promise<SubscriptionPlan> => {
    return await apiClient.put<SubscriptionPlan>(
      `${adminPlansBasePath}/${id}`,
      payload,
    );
  },
  deleteSubscriptionPlan: async (id: string): Promise<void> => {
    await apiClient.delete(`${adminPlansBasePath}/${id}`);
  },
};
