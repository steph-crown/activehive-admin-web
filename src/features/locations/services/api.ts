import { apiClient } from "@/lib/api-client";
import type { Location } from "../types";

const basePath = "/api/admin/locations";

export const locationsApi = {
  getLocations: async (): Promise<Location[]> => {
    return await apiClient.get<Location[]>(basePath);
  },
};
