import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/lib/types";
import type { Trainer } from "../types";

const trainersBasePath = "/api/admin/trainers";

export type UpdateTrainerPayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
};

export type TrainersListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export const trainersApi = {
  getTrainers: async (params: TrainersListParams = {}): Promise<PaginatedResponse<Trainer>> => {
    return await apiClient.get<PaginatedResponse<Trainer>>(trainersBasePath, { params });
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
