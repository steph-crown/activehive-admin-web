import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/lib/types";
import type { Location, LocationDetail } from "../types";

const basePath = "/api/admin/locations";

export type LocationsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
};

export const locationsApi = {
  getLocations: async (params: LocationsListParams = {}): Promise<PaginatedResponse<Location>> => {
    return await apiClient.get<PaginatedResponse<Location>>(basePath, { params });
  },
  getLocationById: async (id: string): Promise<LocationDetail> => {
    const response = await apiClient.get<{ message: string; data: LocationDetail }>(
      `${basePath}/${id}`
    );
    return response.data;
  },
  deactivateLocation: async (id: string): Promise<void> => {
    await apiClient.post(`${basePath}/${id}/deactivate`);
  },
  activateLocation: async (id: string): Promise<void> => {
    await apiClient.post(`${basePath}/${id}/activate`);
  },
};
