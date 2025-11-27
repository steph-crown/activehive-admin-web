import { apiClient } from "@/lib/api-client";
import type { AuthCredentials, AuthResponse, SignupPayload } from "../types";

const basePath = "/auth";

const mockResponse = (payload: AuthCredentials): AuthResponse => ({
  token: crypto.randomUUID(),
  user: {
    id: crypto.randomUUID(),
    email: payload.email,
    name: payload.email.split("@")[0] ?? "ActiveHive User",
  },
});

export const authApi = {
  login: async (payload: AuthCredentials): Promise<AuthResponse> => {
    try {
      return await apiClient.post<AuthResponse>(`${basePath}/login`, payload);
    } catch {
      return mockResponse(payload);
    }
  },
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    try {
      return await apiClient.post<AuthResponse>(`${basePath}/signup`, payload);
    } catch {
      return mockResponse(payload);
    }
  },
};
