import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "./api";
import { profileQueryKeys } from "./queries";
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
    },
  });
};

export const useChangePasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      profileApi.changePassword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
    },
  });
};
