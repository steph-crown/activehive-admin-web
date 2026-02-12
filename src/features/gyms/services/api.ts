import { apiClient } from "@/lib/api-client";
import type { Gym, GymDetailResponse } from "../types";

const basePath = "/api/admin/gyms";

export const gymsApi = {
  getGyms: async (): Promise<Gym[]> => {
    return await apiClient.get<Gym[]>(basePath);
  },
  getGymById: async (id: string): Promise<GymDetailResponse> => {
    return await apiClient.get<GymDetailResponse>(`${basePath}/${id}`);
  },
  deactivateGym: async (id: string): Promise<void> => {
    await apiClient.post(`${basePath}/${id}/deactivate`);
  },
  activateGym: async (id: string): Promise<void> => {
    await apiClient.post(`${basePath}/${id}/activate`);
  },
};
