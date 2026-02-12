import { useMutation, useQueryClient } from "@tanstack/react-query";

import { trainersApi, type UpdateTrainerPayload } from "./api";
import { trainersQueryKeys } from "./queries";

const invalidateTrainers = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: trainersQueryKeys.list(),
  });
};

export const useUpdateTrainerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTrainerPayload;
    }) => trainersApi.updateTrainer(id, payload),
    onSuccess: () => {
      invalidateTrainers(queryClient);
    },
  });
};

export const useDeleteTrainerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => trainersApi.deleteTrainer(id),
    onSuccess: () => {
      invalidateTrainers(queryClient);
    },
  });
};

export const useDeactivateTrainerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => trainersApi.deactivateTrainer(id),
    onSuccess: () => {
      invalidateTrainers(queryClient);
    },
  });
};

export const useActivateTrainerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => trainersApi.activateTrainer(id),
    onSuccess: () => {
      invalidateTrainers(queryClient);
    },
  });
};
