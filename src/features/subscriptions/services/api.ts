import { apiClient } from "@/lib/api-client";
import type { Subscription, SubscriptionPlan } from "../types";

const basePath = "/api/admin/subscriptions";
const publicPlansPath = "/api/subscription-plans/active";

export const subscriptionsApi = {
  getSubscriptions: async (): Promise<Subscription[]> => {
    return await apiClient.get<Subscription[]>(basePath);
  },
  getActivePlans: async (
    planType: "gym_owner" | "trainer",
  ): Promise<SubscriptionPlan[]> => {
    return await apiClient.get<SubscriptionPlan[]>(publicPlansPath, {
      params: { planType },
    });
  },
};
