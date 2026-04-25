import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { trainersApi } from "./api";
import type { TrainersListParams } from "./api";
import type { PaginatedResponse } from "@/lib/types";
import type { Trainer } from "../types";

export const trainersQueryKeys = {
  all: ["trainers"] as const,
  list: () => [...trainersQueryKeys.all, "list"] as const,
};

export const useTrainersQuery = (params: TrainersListParams = {}) =>
  useQuery<PaginatedResponse<Trainer>>({
    queryKey: [...trainersQueryKeys.list(), params],
    queryFn: () => trainersApi.getTrainers(params),
    placeholderData: keepPreviousData,
  });
