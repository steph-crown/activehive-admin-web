import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  gymOwnersApi,
  type ApproveStepPayload,
  type UpdateGymOwnerPayload,
} from "./api";
import { gymOwnersQueryKeys } from "./queries";

const invalidateGymOwners = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: gymOwnersQueryKeys.list(),
  });
};

export const useApproveStepMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: ApproveStepPayload;
    }) => gymOwnersApi.approveStep(userId, payload),
    onSuccess: () => {
      invalidateGymOwners(queryClient);
    },
  });
};

export const useUpdateGymOwnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateGymOwnerPayload;
    }) => gymOwnersApi.updateGymOwner(id, payload),
    onSuccess: () => {
      invalidateGymOwners(queryClient);
    },
  });
};

export const useDeactivateGymOwnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gymOwnersApi.deactivateGymOwner(id),
    onSuccess: () => {
      invalidateGymOwners(queryClient);
    },
  });
};

export const useActivateGymOwnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gymOwnersApi.activateGymOwner(id),
    onSuccess: () => {
      invalidateGymOwners(queryClient);
    },
  });
};
