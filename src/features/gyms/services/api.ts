import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse, SortOrder } from "@/lib/types";
import type {
  Gym,
  GymDetailResponse,
  GymRegistrationStatusResponse,
} from "../types";

const basePath = "/api/admin/gyms";

export type GymsListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortOrder;
  search?: string;
  approvalStatus?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  subscriptionPlan?: string;
};

export const gymsApi = {
  getGyms: async (params: GymsListParams = {}): Promise<PaginatedResponse<Gym>> => {
    return await apiClient.get<PaginatedResponse<Gym>>(basePath, { params });
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
  getGymRegistrationStatus: async (
    id: string,
  ): Promise<GymRegistrationStatusResponse> => {
    return await apiClient.get<GymRegistrationStatusResponse>(
      `/api/gym/${id}/registration-status`,
    );
  },
  finalizeGymApplication: async (
    approvalId: string,
    payload: { status: "approved" | "rejected"; reason?: string },
  ): Promise<void> => {
    await apiClient.post(
      `/api/admin/approvals/${approvalId}/finalize`,
      payload,
    );
  },
};
