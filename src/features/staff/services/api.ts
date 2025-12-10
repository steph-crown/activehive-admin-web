import { apiClient } from "@/lib/api-client";

const basePath = "/api/admin/staff";

export const staffApi = {
  getStaff: async () => {
    return await apiClient.get(basePath);
  },
};
