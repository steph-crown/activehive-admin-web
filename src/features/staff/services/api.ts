import { apiClient } from "@/lib/api-client";
import type { Staff } from "../types";

export const staffApi = {
  getStaff: async (): Promise<Staff[]> => {
    return await apiClient.get<Staff[]>("/api/admin/users", {
      params: { role: "staff" },
    });
  },
};
