import { useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import type { AuthCredentials, AuthResponse, SignupPayload } from "../types";

export const useLoginMutation = () =>
  useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async (payload) => authApi.login(payload),
  });

export const useSignupMutation = () =>
  useMutation<AuthResponse, Error, SignupPayload>({
    mutationFn: async (payload) => authApi.signup(payload),
  });
