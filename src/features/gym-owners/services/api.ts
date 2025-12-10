import { apiClient } from "@/lib/api-client";
import type { GymOwner } from "../types";

const basePath = "/api/admin/gym-owners";

export const gymOwnersApi = {
  getGymOwners: async (): Promise<GymOwner[]> => {
    return await apiClient.get<GymOwner[]>(basePath);
  },
};
