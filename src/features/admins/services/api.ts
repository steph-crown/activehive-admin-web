import { apiClient } from "@/lib/api-client";
import type { Admin } from "../types";

export type CreateAdminFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
};

export const adminsApi = {
  getAdmins: async (): Promise<Admin[]> => {
    return await apiClient.get<Admin[]>("/api/admin/users", {
      params: { role: "admin" },
    });
  },
  createAdmin: async (payload: CreateAdminFormData): Promise<Admin> => {
    const secretKey = import.meta.env.VITE_ADMIN_SECRET_KEY ?? "admin_activehive_api_secret";
    return await apiClient.post<Admin>("/api/admin/create", {
      ...payload,
      secretKey,
    });
  },
};
