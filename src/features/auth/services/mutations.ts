import { useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import type {
  AuthCredentials,
  AuthResponse,
  RegisterResponse,
  SignupPayload,
} from "../types";

export const useLoginMutation = () =>
  useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async (payload) => authApi.login(payload),
  });

export const useSignupMutation = () =>
  useMutation<RegisterResponse, Error, SignupPayload>({
    mutationFn: async (payload) => authApi.signup(payload),
  });
