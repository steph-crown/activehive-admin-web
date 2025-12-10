import { apiClient } from "@/lib/api-client";

const basePath = "/api/admin/trainers";

export const trainersApi = {
  getTrainers: async () => {
    return await apiClient.get(basePath);
  },
};
