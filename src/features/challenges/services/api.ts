import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/lib/types";
import {
  normalizeChallengeApi,
  toApiCreateBody,
  toApiUpdateBody,
  toPlatformChallenge,
} from "../lib/challenge-api-mapper";
import type {
  ChallengeApi,
  CreateChallengePayload,
  PlatformChallenge,
  UpdateChallengePayload,
} from "../types";

const basePath = "/api/admin/challenges";

export type ChallengesListParams = {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

export const challengesApi = {
  getChallenges: async (
    params: ChallengesListParams = {},
  ): Promise<PaginatedResponse<PlatformChallenge>> => {
    const response = await apiClient.get<PaginatedResponse<ChallengeApi>>(
      basePath,
      { params },
    );

    return {
      data: (response.data ?? []).map((item) =>
        toPlatformChallenge(normalizeChallengeApi(item)),
      ),
      pagination: response.pagination,
    };
  },
  createChallenge: async (
    payload: CreateChallengePayload,
  ): Promise<PlatformChallenge> => {
    const body = toApiCreateBody(payload);
    const created = await apiClient.post<ChallengeApi>(basePath, body);
    return toPlatformChallenge(normalizeChallengeApi(created));
  },
  updateChallenge: async (
    payload: UpdateChallengePayload,
  ): Promise<PlatformChallenge> => {
    const body = toApiUpdateBody(payload);
    const updated = await apiClient.patch<ChallengeApi>(
      `${basePath}/${payload.id}`,
      body,
    );
    return toPlatformChallenge(normalizeChallengeApi(updated));
  },
  deleteChallenge: async (id: string): Promise<void> => {
    await apiClient.delete(`${basePath}/${id}`);
  },
};
