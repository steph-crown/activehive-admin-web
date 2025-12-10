import { useQuery } from "@tanstack/react-query";
import { trainersApi } from "./api";

export const trainersQueryKeys = {
  all: ["trainers"] as const,
  list: () => [...trainersQueryKeys.all, "list"] as const,
};

export const useTrainersQuery = () =>
  useQuery({
    queryKey: trainersQueryKeys.list(),
    queryFn: () => trainersApi.getTrainers(),
  });
