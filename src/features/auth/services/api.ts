import { apiClient } from "@/lib/api-client";
import type {
  AuthCredentials,
  AuthResponse,
  RegisterResponse,
  SignupPayload,
} from "../types";

const basePath = "/api/auth";

export const authApi = {
  login: (payload: AuthCredentials): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(`${basePath}/login`, payload),
  signup: (payload: SignupPayload): Promise<RegisterResponse> =>
    apiClient.post<RegisterResponse>(`${basePath}/register`, payload),
};
