import { apiClient } from "@/lib/api-client";

const basePath = "/api/admin/gym-owners";

export const gymOwnersApi = {
  getGymOwners: async () => {
    return await apiClient.get(basePath);
  },
};
