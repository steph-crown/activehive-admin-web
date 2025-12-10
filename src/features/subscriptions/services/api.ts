import { apiClient } from "@/lib/api-client";
import type { Subscription } from "../types";

const basePath = "/api/admin/subscriptions";

export const subscriptionsApi = {
  getSubscriptions: async (): Promise<Subscription[]> => {
    return await apiClient.get<Subscription[]>(basePath);
  },
};
