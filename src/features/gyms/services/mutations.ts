import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gymsApi } from "./api";
import { gymsQueryKeys } from "./queries";

const invalidateGyms = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: gymsQueryKeys.list(),
  });
};

export const useDeactivateGymMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gymsApi.deactivateGym(id),
    onSuccess: () => {
      invalidateGyms(queryClient);
    },
  });
};

export const useActivateGymMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gymsApi.activateGym(id),
    onSuccess: () => {
      invalidateGyms(queryClient);
    },
  });
};
