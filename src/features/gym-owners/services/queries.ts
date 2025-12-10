import { useQuery } from "@tanstack/react-query";
import { gymOwnersApi } from "./api";
import type { GymOwner } from "../types";

export const gymOwnersQueryKeys = {
  all: ["gym-owners"] as const,
  list: () => [...gymOwnersQueryKeys.all, "list"] as const,
};

export const useGymOwnersQuery = () =>
  useQuery<GymOwner[]>({
    queryKey: gymOwnersQueryKeys.list(),
    queryFn: () => gymOwnersApi.getGymOwners(),
  });
