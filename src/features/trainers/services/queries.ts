import { useQuery } from "@tanstack/react-query";
import { trainersApi } from "./api";
import type { Trainer } from "../types";

export const trainersQueryKeys = {
  all: ["trainers"] as const,
  list: () => [...trainersQueryKeys.all, "list"] as const,
};

export const useTrainersQuery = () =>
  useQuery<Trainer[]>({
    queryKey: trainersQueryKeys.list(),
    queryFn: () => trainersApi.getTrainers(),
  });
