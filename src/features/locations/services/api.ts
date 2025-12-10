import { apiClient } from "@/lib/api-client";

const basePath = "/api/admin/locations";

export const locationsApi = {
  getLocations: async () => {
    return await apiClient.get(basePath);
  },
};
