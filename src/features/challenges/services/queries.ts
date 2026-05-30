import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { PaginatedResponse } from "@/lib/types";
import type { PlatformChallenge } from "../types";
import { challengesApi } from "./api";
import type { ChallengesListParams } from "./api";

export const challengesQueryKeys = {
  all: ["challenges"] as const,
  list: () => [...challengesQueryKeys.all, "list"] as const,
};

export const useChallengesQuery = (params: ChallengesListParams = {}) =>
  useQuery<PaginatedResponse<PlatformChallenge>>({
    queryKey: [...challengesQueryKeys.list(), params],
    queryFn: () => challengesApi.getChallenges(params),
    placeholderData: keepPreviousData,
  });
