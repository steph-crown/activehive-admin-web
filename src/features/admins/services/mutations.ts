import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminsApi,
  type CreateAdminFormData,
  type UpdateAdminPayload,
} from "./api";
import { adminsQueryKeys } from "./queries";

const invalidateAdmins = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: adminsQueryKeys.list(),
  });
};

export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminFormData) =>
      adminsApi.createAdmin(payload),
    onSuccess: () => {
      invalidateAdmins(queryClient);
    },
  });
};

export const useUpdateAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminPayload;
    }) => adminsApi.updateAdmin(id, payload),
    onSuccess: () => {
      invalidateAdmins(queryClient);
    },
  });
};

export const useDeleteAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminsApi.deleteAdmin(id),
    onSuccess: () => {
      invalidateAdmins(queryClient);
    },
  });
};

export const useDeactivateAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminsApi.deactivateAdmin(id),
    onSuccess: () => {
      invalidateAdmins(queryClient);
    },
  });
};

export const useActivateAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminsApi.activateAdmin(id),
    onSuccess: () => {
      invalidateAdmins(queryClient);
    },
  });
};
