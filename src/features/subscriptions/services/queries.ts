import { useQuery } from "@tanstack/react-query";
import { subscriptionsApi } from "./api";

export const subscriptionsQueryKeys = {
  all: ["subscriptions"] as const,
  list: () => [...subscriptionsQueryKeys.all, "list"] as const,
};

export const useSubscriptionsQuery = () =>
  useQuery({
    queryKey: subscriptionsQueryKeys.list(),
    queryFn: () => subscriptionsApi.getSubscriptions(),
  });
