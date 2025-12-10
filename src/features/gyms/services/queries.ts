import { useQuery } from "@tanstack/react-query";
import { gymsApi } from "./api";

export const gymsQueryKeys = {
  all: ["gyms"] as const,
  list: () => [...gymsQueryKeys.all, "list"] as const,
};

export const useGymsQuery = () =>
  useQuery({
    queryKey: gymsQueryKeys.list(),
    queryFn: () => gymsApi.getGyms(),
  });
