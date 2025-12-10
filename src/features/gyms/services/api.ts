import { apiClient } from "@/lib/api-client";
import type { Gym } from "../types";

const basePath = "/api/admin/gyms";

export const gymsApi = {
  getGyms: async (): Promise<Gym[]> => {
    return await apiClient.get<Gym[]>(basePath);
  },
};
