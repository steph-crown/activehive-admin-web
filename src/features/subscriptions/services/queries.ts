import { useQuery } from "@tanstack/react-query";
import { subscriptionsApi } from "./api";
import type { Subscription, SubscriptionPlan } from "../types";

export const subscriptionsQueryKeys = {
  all: ["subscriptions"] as const,
  list: () => [...subscriptionsQueryKeys.all, "list"] as const,
};

export const subscriptionPlansQueryKeys = {
  all: ["subscription-plans"] as const,
  list: (planType: "gym_owner" | "trainer") =>
    [...subscriptionPlansQueryKeys.all, "list", planType] as const,
};

export const useSubscriptionsQuery = () =>
  useQuery<Subscription[]>({
    queryKey: subscriptionsQueryKeys.list(),
    queryFn: () => subscriptionsApi.getSubscriptions(),
  });

export const useSubscriptionPlansQuery = (planType: "gym_owner" | "trainer") =>
  useQuery<SubscriptionPlan[]>({
    queryKey: subscriptionPlansQueryKeys.list(planType),
    queryFn: () => subscriptionsApi.getActivePlans(planType),
  });
