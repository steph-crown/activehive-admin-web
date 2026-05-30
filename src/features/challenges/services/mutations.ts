import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateChallengePayload, UpdateChallengePayload } from "../types";
import { challengesApi } from "./api";
import { challengesQueryKeys } from "./queries";

const invalidateChallenges = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({
    queryKey: challengesQueryKeys.list(),
  });
};

export const useCreateChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChallengePayload) =>
      challengesApi.createChallenge(payload),
    onSuccess: () => {
      invalidateChallenges(queryClient);
    },
  });
};

export const useUpdateChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateChallengePayload) =>
      challengesApi.updateChallenge(payload),
    onSuccess: () => {
      invalidateChallenges(queryClient);
    },
  });
};

export const useDeleteChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => challengesApi.deleteChallenge(id),
    onSuccess: () => {
      invalidateChallenges(queryClient);
    },
  });
};
