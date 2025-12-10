import { apiClient } from "@/lib/api-client";

const basePath = "/api/admin/members";

export const membersApi = {
  getMembers: async () => {
    return await apiClient.get(basePath);
  },
};
