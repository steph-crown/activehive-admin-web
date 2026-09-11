import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  subscriptionsApi,
  type CreateSubscriptionPlanPayload,
  type UpdateSubscriptionPlanPayload,
  type RenewSubscriptionPayload,
} from "./api";
import {
  adminSubscriptionPlansQueryKeys,
  subscriptionPlansQueryKeys,
  subscriptionsQueryKeys,
} from "./queries";

type PlanAudience = "gym_owner" | "trainer";

const invalidatePlans = (
  queryClient: ReturnType<typeof useQueryClient>,
  planType: PlanAudience,
) => {
  queryClient.invalidateQueries({
    queryKey: subscriptionPlansQueryKeys.list(planType),
  });
  queryClient.invalidateQueries({
    queryKey: adminSubscriptionPlansQueryKeys.list(planType),
  });
  queryClient.invalidateQueries({
    queryKey: adminSubscriptionPlansQueryKeys.list(),
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

export const useActivateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      planType,
    }: {
      id: string;
      planType: PlanAudience;
    }) =>
      subscriptionsApi
        .activateSubscriptionPlan(id)
        .then((data) => ({ ...data, planType })),
    onSuccess: ({ planType }) => {
      invalidatePlans(queryClient, planType);
    },
  });
};

export const useDeactivateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      planType,
    }: {
      id: string;
      planType: PlanAudience;
    }) =>
      subscriptionsApi
        .deactivateSubscriptionPlan(id)
        .then((data) => ({ ...data, planType })),
    onSuccess: ({ planType }) => {
      invalidatePlans(queryClient, planType);
    },
  });
};

export const useRenewSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subscriptionId,
      payload,
    }: {
      subscriptionId: string;
      payload?: RenewSubscriptionPayload;
    }) => subscriptionsApi.renewSubscription(subscriptionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.list(),
      });
    },
  });
};

