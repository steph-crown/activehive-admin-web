import { useMutation, useQueryClient } from "@tanstack/react-query";

import { staffApi, type UpdateStaffPayload } from "./api";
import { staffQueryKeys } from "./queries";

const invalidateStaff = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: staffQueryKeys.list(),
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStaffPayload;
    }) => staffApi.updateStaff(id, payload),
    onSuccess: () => {
      invalidateStaff(queryClient);
    },
  });
};

export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffApi.deleteStaff(id),
    onSuccess: () => {
      invalidateStaff(queryClient);
    },
  });
};

export const useDeactivateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffApi.deactivateStaff(id),
    onSuccess: () => {
      invalidateStaff(queryClient);
    },
  });
};

export const useActivateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffApi.activateStaff(id),
    onSuccess: () => {
      invalidateStaff(queryClient);
    },
  });
};
