import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { subscriptionsApi } from "./api";
import type { SubscriptionsListParams, SubscriptionStats, PlanFeatureOption } from "./api";
import type { PaginatedResponse } from "@/lib/types";
import type {
  Subscription,
  SubscriptionDetail,
  SubscriptionPlan,
  SubscriptionRenewalHistory,
} from "../types";

export const subscriptionsQueryKeys = {
  all: ["subscriptions"] as const,
  list: () => [...subscriptionsQueryKeys.all, "list"] as const,
  detail: (id: string) => [...subscriptionsQueryKeys.all, "detail", id] as const,
  stats: () => [...subscriptionsQueryKeys.all, "stats"] as const,
};

export const planFeatureFlagsQueryKeys = {
  all: ["plan-feature-flags"] as const,
};

/** Public active-plans endpoint — used by plan picker modals shown to gym owners/trainers. */
export const subscriptionPlansQueryKeys = {
  all: ["subscription-plans"] as const,
  list: (planType: "gym_owner" | "trainer") =>
    [...subscriptionPlansQueryKeys.all, "list", planType] as const,
  detail: (id: string) =>
    [...subscriptionPlansQueryKeys.all, "detail", id] as const,
};

/** Admin-only endpoint — returns ALL plans including inactive ones. */
export const adminSubscriptionPlansQueryKeys = {
  all: ["admin-subscription-plans"] as const,
  list: (planType?: "gym_owner" | "trainer") =>
    [...adminSubscriptionPlansQueryKeys.all, "list", planType ?? "all"] as const,
};

export const renewalHistoryQueryKeys = {
  all: ["renewal-history"] as const,
  bySubscription: (id: string) =>
    [...renewalHistoryQueryKeys.all, id] as const,
};

export const useSubscriptionStatsQuery = () =>
  useQuery<SubscriptionStats>({
    queryKey: subscriptionsQueryKeys.stats(),
    queryFn: () => subscriptionsApi.getStats(),
    staleTime: 60_000,
  });

export const usePlanFeatureFlagsQuery = () =>
  useQuery<PlanFeatureOption[]>({
    queryKey: planFeatureFlagsQueryKeys.all,
    queryFn: () => subscriptionsApi.getFeatureFlags(),
    staleTime: Infinity,
  });

export const useSubscriptionsQuery = (params: SubscriptionsListParams = {}) =>
  useQuery<PaginatedResponse<Subscription>>({
    queryKey: [...subscriptionsQueryKeys.list(), params],
    queryFn: () => subscriptionsApi.getSubscriptions(params),
    placeholderData: keepPreviousData,
  });

export const useSubscriptionDetailQuery = (id: string | undefined) =>
  useQuery<SubscriptionDetail>({
    queryKey: subscriptionsQueryKeys.detail(id ?? ""),
    queryFn: () => subscriptionsApi.getSubscriptionById(id!),
    enabled: Boolean(id),
  });

/** Public active plans — only isActive=true plans. Used by gym-owner-facing plan pickers. */
export const useSubscriptionPlansQuery = (planType: "gym_owner" | "trainer") =>
  useQuery<SubscriptionPlan[]>({
    queryKey: subscriptionPlansQueryKeys.list(planType),
    queryFn: () => subscriptionsApi.getActivePlans(planType),
  });

/** Admin plans list — includes inactive plans. Use this in admin management pages. */
export const useAdminSubscriptionPlansQuery = (
  planType?: "gym_owner" | "trainer",
) =>
  useQuery<SubscriptionPlan[]>({
    queryKey: adminSubscriptionPlansQueryKeys.list(planType),
    queryFn: () => subscriptionsApi.getAllPlansAdmin(planType),
  });

export const useSubscriptionPlanDetailQuery = (id: string | undefined) =>
  useQuery<SubscriptionPlan>({
    queryKey: subscriptionPlansQueryKeys.detail(id ?? ""),
    queryFn: () => subscriptionsApi.getSubscriptionPlanById(id!),
    enabled: Boolean(id),
  });

export const useRenewalHistoryQuery = (subscriptionId: string | undefined) =>
  useQuery<SubscriptionRenewalHistory[]>({
    queryKey: renewalHistoryQueryKeys.bySubscription(subscriptionId ?? ""),
    queryFn: () => subscriptionsApi.getRenewalHistory(subscriptionId!),
    enabled: Boolean(subscriptionId),
  });
