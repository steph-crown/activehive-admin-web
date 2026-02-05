import { useQuery } from "@tanstack/react-query";
import { gymsApi } from "./api";
import type { Gym, GymDetailResponse } from "../types";

export const gymsQueryKeys = {
  all: ["gyms"] as const,
  list: () => [...gymsQueryKeys.all, "list"] as const,
  detail: (id: string) => [...gymsQueryKeys.all, "detail", id] as const,
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
