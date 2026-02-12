import { apiClient } from "@/lib/api-client";
import type { Admin } from "../types";

export type CreateAdminFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
};

export type UpdateAdminPayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  password?: string;
};

export const adminsApi = {
  getAdmins: async (): Promise<Admin[]> => {
    return await apiClient.get<Admin[]>("/api/admin/users", {
      params: { role: "admin" },
    });
  },
  createAdmin: async (payload: CreateAdminFormData): Promise<Admin> => {
    const secretKey =
      import.meta.env.VITE_ADMIN_SECRET_KEY ?? "admin_activehive_api_secret";
    return await apiClient.post<Admin>("/api/admin/create", {
      ...payload,
      secretKey,
    });
  },
  updateAdmin: async (
    id: string,
    payload: UpdateAdminPayload,
  ): Promise<Admin> => {
    return await apiClient.patch<Admin>(`/api/admin/admins/${id}`, payload);
  },
  deleteAdmin: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/admin/admins/${id}`);
  },
  deactivateAdmin: async (id: string): Promise<void> => {
    await apiClient.post(`/api/admin/admins/${id}/deactivate`);
  },
  activateAdmin: async (id: string): Promise<void> => {
    await apiClient.post(`/api/admin/admins/${id}/activate`);
  },
};
