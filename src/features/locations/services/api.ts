import { apiClient } from "@/lib/api-client";
import type { Location, LocationDetail } from "../types";

const basePath = "/api/admin/locations";

export const locationsApi = {
  getLocations: async (): Promise<Location[]> => {
    return await apiClient.get<Location[]>(basePath);
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
