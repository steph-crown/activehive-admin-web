import { apiClient } from "@/lib/api-client";

const basePath = "/api/admin/subscriptions";

export const subscriptionsApi = {
  getSubscriptions: async () => {
    return await apiClient.get(basePath);
  },
};
