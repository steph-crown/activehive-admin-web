import { useQuery } from "@tanstack/react-query";
import { gymOwnersApi } from "./api";

export const gymOwnersQueryKeys = {
  all: ["gym-owners"] as const,
  list: () => [...gymOwnersQueryKeys.all, "list"] as const,
};

export const useGymOwnersQuery = () =>
  useQuery({
    queryKey: gymOwnersQueryKeys.list(),
    queryFn: () => gymOwnersApi.getGymOwners(),
  });
