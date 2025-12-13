import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gymOwnersApi, type ApproveStepPayload } from "./api";
import { gymOwnersQueryKeys } from "./queries";

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
      // Invalidate and refetch gym owners list
      queryClient.invalidateQueries({
        queryKey: gymOwnersQueryKeys.all,
      });
    },
  });
};
