import { apiClient } from "@/lib/api-client";
import type { GymOwner } from "../types";

const basePath = "/api/admin/gym-owners";

export type ApproveStepPayload = {
  step: string;
  status: "approved" | "rejected";
  comments?: string;
};

export type UpdateGymOwnerPayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export const gymOwnersApi = {
  getGymOwners: async (): Promise<GymOwner[]> => {
    return await apiClient.get<GymOwner[]>(basePath);
  },
  approveStep: async (
    userId: string,
    payload: ApproveStepPayload
  ): Promise<unknown> => {
    return await apiClient.post(
      `/api/admin/approvals/user/${userId}/approve-step`,
      payload
    );
  },
  updateGymOwner: async (
    id: string,
    payload: UpdateGymOwnerPayload
  ): Promise<GymOwner> => {
    return await apiClient.patch<GymOwner>(`${basePath}/${id}`, payload);
  },
  deactivateGymOwner: async (id: string): Promise<void> => {
    await apiClient.post(`${basePath}/${id}/deactivate`);
  },
  activateGymOwner: async (id: string): Promise<void> => {
    await apiClient.post(`${basePath}/${id}/activate`);
  },
};
