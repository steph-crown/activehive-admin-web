import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminsApi, type CreateAdminPayload } from "./api";
import { adminsQueryKeys } from "./queries";

export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminPayload) =>
      adminsApi.createAdmin(payload),
    onSuccess: () => {
      // Invalidate and refetch admins list
      queryClient.invalidateQueries({
        queryKey: adminsQueryKeys.all,
      });
    },
  });
};
