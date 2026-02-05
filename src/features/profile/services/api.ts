import { apiClient } from "@/lib/api-client";
import type {
  Profile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types";

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    return await apiClient.get<Profile>("/api/profile");
  },
  updateProfile: async (payload: UpdateProfilePayload): Promise<Profile> => {
    return await apiClient.put<Profile>("/api/profile", payload);
  },
  changePassword: async (
    payload: ChangePasswordPayload
  ): Promise<unknown> => {
    return await apiClient.post("/api/profile/change-password", payload);
  },
};
