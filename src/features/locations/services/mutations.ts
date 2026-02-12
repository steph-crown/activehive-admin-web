import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApi } from "./api";
import { locationsQueryKeys } from "./queries";

const invalidateLocations = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: locationsQueryKeys.list(),
  });
};

export const useDeactivateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => locationsApi.deactivateLocation(id),
    onSuccess: () => {
      invalidateLocations(queryClient);
    },
  });
};

export const useActivateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => locationsApi.activateLocation(id),
    onSuccess: () => {
      invalidateLocations(queryClient);
    },
  });
};
