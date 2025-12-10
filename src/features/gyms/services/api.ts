import { apiClient } from "@/lib/api-client";

const basePath = "/api/admin/gyms";

export const gymsApi = {
  getGyms: async () => {
    return await apiClient.get(basePath);
  },
};
