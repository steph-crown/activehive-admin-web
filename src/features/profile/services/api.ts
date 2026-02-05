import { apiClient } from "@/lib/api-client";
import type { Profile } from "../types";

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    return await apiClient.get<Profile>("/api/profile");
  },
};
