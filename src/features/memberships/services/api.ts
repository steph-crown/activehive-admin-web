import { apiClient } from "@/lib/api-client";

const basePath = "/api/admin/memberships";

export const membershipsApi = {
  getMemberships: async () => {
    return await apiClient.get(basePath);
  },
};
