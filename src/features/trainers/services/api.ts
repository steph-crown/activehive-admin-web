import { apiClient } from "@/lib/api-client";
import type { Trainer } from "../types";

const trainersBasePath = "/api/admin/trainers";

export type UpdateTrainerPayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
};

export const trainersApi = {
  getTrainers: async (): Promise<Trainer[]> => {
    return await apiClient.get<Trainer[]>("/api/admin/users", {
      params: { role: "trainer" },
    });
  },
  updateTrainer: async (
    id: string,
    payload: UpdateTrainerPayload,
  ): Promise<Trainer> => {
    return await apiClient.patch<Trainer>(`${trainersBasePath}/${id}`, payload);
  },
  deleteTrainer: async (id: string): Promise<void> => {
    await apiClient.delete(`${trainersBasePath}/${id}`);
  },
  deactivateTrainer: async (id: string): Promise<void> => {
    await apiClient.post(`${trainersBasePath}/${id}/deactivate`);
  },
  activateTrainer: async (id: string): Promise<void> => {
    await apiClient.post(`${trainersBasePath}/${id}/activate`);
  },
};
