import { useQuery } from "@tanstack/react-query";
import { gymsApi } from "./api";
import type { Gym } from "../types";

export const gymsQueryKeys = {
  all: ["gyms"] as const,
  list: () => [...gymsQueryKeys.all, "list"] as const,
};

export const useGymsQuery = () =>
  useQuery<Gym[]>({
    queryKey: gymsQueryKeys.list(),
    queryFn: () => gymsApi.getGyms(),
  });
