import { apiClient } from "@/lib/api-client";
import type { Admin, CreateAdminPayload } from "../types";

export const adminsApi = {
  getAdmins: async (): Promise<Admin[]> => {
    return await apiClient.get<Admin[]>("/api/admin/users", {
      params: { role: "admin" },
    });
  },
  createAdmin: async (payload: CreateAdminPayload): Promise<Admin> => {
    return await apiClient.post<Admin>("/api/admin/create", payload);
  },
};
