import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/lib/types";
import type { BillingPeriod } from "../constants";
import type { Subscription, SubscriptionPlan, SubscriptionRenewalHistory } from "../types";

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
  featureFlags?: string[];
  maxStaff?: number | null;
  maxLocations?: number | null;
  maxClassesPerMonth?: number | null;
  trialDays: number | null;
  hasTrial: boolean;
  isActive: boolean;
  isDefault: boolean;
  isPopular: boolean;
  sortOrder: number | null;
};

export type UpdateSubscriptionPlanPayload =
  Partial<CreateSubscriptionPlanPayload>;

export type RenewSubscriptionPayload = {
  planId?: string;
  promoCode?: string | null;
};

export type SubscriptionsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  dateFrom?: string;
};

export type SubscriptionStats = {
  total: number;
  active: number;
  cancelled: number;
  trialOrExpired: number;
  byStatus: Record<string, number>;
};

export type PlanFeatureOption = {
  value: string;
  label: string;
};

export const subscriptionsApi = {
  getStats: async (): Promise<SubscriptionStats> =>
    apiClient.get<SubscriptionStats>(`${adminPlansBasePath}/stats`),

  getFeatureFlags: async (): Promise<PlanFeatureOption[]> =>
    apiClient.get<PlanFeatureOption[]>(`${adminPlansBasePath}/feature-flags`),
  getSubscriptions: async (
    params: SubscriptionsListParams = {},
  ): Promise<PaginatedResponse<Subscription>> => {
    return await apiClient.get<PaginatedResponse<Subscription>>(
      subscriptionsBasePath,
      { params },
    );
  },
  renewSubscription: async (
    id: string,
    payload?: RenewSubscriptionPayload,
  ): Promise<unknown> => {
    return await apiClient.post<unknown>(
      `${subscriptionsBasePath}/${id}/renew`,
      payload ?? {},
    );
  },
  getActivePlans: async (
    planType: "gym_owner" | "trainer",
  ): Promise<SubscriptionPlan[]> => {
    const res = await apiClient.get<
      SubscriptionPlan[] | { data: SubscriptionPlan[] }
    >(publicPlansPath, { params: { planType } });
    return Array.isArray(res)
      ? res
      : ((res as { data: SubscriptionPlan[] }).data ?? []);
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
  activateSubscriptionPlan: async (id: string): Promise<SubscriptionPlan> => {
    return await apiClient.patch<SubscriptionPlan>(
      `${adminPlansBasePath}/plans/${id}/activate`,
    );
  },
  deactivateSubscriptionPlan: async (id: string): Promise<SubscriptionPlan> => {
    return await apiClient.patch<SubscriptionPlan>(
      `${adminPlansBasePath}/plans/${id}/deactivate`,
    );
  },

  /** Admin-only: returns ALL plans (active and inactive) for the given type. */
  getAllPlansAdmin: async (
    planType?: "gym_owner" | "trainer",
  ): Promise<SubscriptionPlan[]> => {
    return await apiClient.get<SubscriptionPlan[]>(adminPlansBasePath, {
      params: planType ? { planType } : undefined,
    });
  },

  getSubscriptionById: async (id: string): Promise<Subscription> => {
    return await apiClient.get<Subscription>(`${subscriptionsBasePath}/${id}`);
  },

  getRenewalHistory: async (
    subscriptionId: string,
  ): Promise<SubscriptionRenewalHistory[]> => {
    return await apiClient.get<SubscriptionRenewalHistory[]>(
      `${adminPlansBasePath}/subscriptions/${subscriptionId}/renewal-history`,
    );
  },
};
