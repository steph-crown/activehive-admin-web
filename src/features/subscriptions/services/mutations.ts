import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  subscriptionsApi,
  type CreateSubscriptionPlanPayload,
  type UpdateSubscriptionPlanPayload,
} from "./api";
import { subscriptionPlansQueryKeys } from "./queries";

type PlanAudience = "gym_owner" | "trainer";

const invalidatePlans = (
  queryClient: ReturnType<typeof useQueryClient>,
  planType: PlanAudience,
) => {
  queryClient.invalidateQueries({
    queryKey: subscriptionPlansQueryKeys.list(planType),
  });
};

export const useCreateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPlanPayload) =>
      subscriptionsApi.createSubscriptionPlan(payload),
    onSuccess: (data) => {
      invalidatePlans(queryClient, data.planType);
    },
  });
};

export const useUpdateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSubscriptionPlanPayload;
    }) => subscriptionsApi.updateSubscriptionPlan(id, payload),
    onSuccess: (data) => {
      invalidatePlans(queryClient, data.planType);
    },
  });
};

export const useDeleteSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      planType,
    }: {
      id: string;
      planType: PlanAudience;
    }) => {
      await subscriptionsApi.deleteSubscriptionPlan(id);
      return { planType };
    },
    onSuccess: ({ planType }) => {
      invalidatePlans(queryClient, planType);
    },
  });
};

