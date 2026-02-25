import { useQuery } from "@tanstack/react-query";
import { gymsApi } from "./api";
import type {
  Gym,
  GymDetailResponse,
  GymRegistrationStatusResponse,
} from "../types";

export const gymsQueryKeys = {
  all: ["gyms"] as const,
  list: () => [...gymsQueryKeys.all, "list"] as const,
  detail: (id: string) => [...gymsQueryKeys.all, "detail", id] as const,
  registrationStatus: (id: string) =>
    [...gymsQueryKeys.all, "registration-status", id] as const,
};

export const useGymsQuery = () =>
  useQuery<Gym[]>({
    queryKey: gymsQueryKeys.list(),
    queryFn: () => gymsApi.getGyms(),
  });

export const useGymByIdQuery = (id: string | undefined, enabled = true) =>
  useQuery<GymDetailResponse>({
    queryKey: gymsQueryKeys.detail(id ?? ""),
    queryFn: () => gymsApi.getGymById(id!),
    enabled: Boolean(id) && enabled,
  });

export const useGymRegistrationStatusQuery = (
  id: string | undefined,
  enabled = true,
) =>
  useQuery<GymRegistrationStatusResponse>({
    queryKey: gymsQueryKeys.registrationStatus(id ?? ""),
    queryFn: () => gymsApi.getGymRegistrationStatus(id!),
    enabled: Boolean(id) && enabled,
  });
