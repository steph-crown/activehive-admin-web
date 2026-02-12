import { apiClient } from "@/lib/api-client";
import type { Staff } from "../types";

const staffBasePath = "/api/admin/staff";

export type UpdateStaffPayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
};

export const staffApi = {
  getStaff: async (): Promise<Staff[]> => {
    return await apiClient.get<Staff[]>("/api/admin/users", {
      params: { role: "staff" },
    });
  },
  updateStaff: async (
    id: string,
    payload: UpdateStaffPayload,
  ): Promise<Staff> => {
    return await apiClient.patch<Staff>(`${staffBasePath}/${id}`, payload);
  },
  deleteStaff: async (id: string): Promise<void> => {
    await apiClient.delete(`${staffBasePath}/${id}`);
  },
  deactivateStaff: async (id: string): Promise<void> => {
    await apiClient.post(`${staffBasePath}/${id}/deactivate`);
  },
  activateStaff: async (id: string): Promise<void> => {
    await apiClient.post(`${staffBasePath}/${id}/activate`);
  },
};
