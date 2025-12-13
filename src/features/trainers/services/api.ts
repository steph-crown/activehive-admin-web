import { apiClient } from "@/lib/api-client";
import type { Trainer } from "../types";

export const trainersApi = {
  getTrainers: async (): Promise<Trainer[]> => {
    return await apiClient.get<Trainer[]>("/api/admin/users", {
      params: { role: "trainer" },
    });
  },
};
