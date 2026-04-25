import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { locationsApi } from "./api";
import type { LocationsListParams } from "./api";
import type { PaginatedResponse } from "@/lib/types";
import type { Location, LocationDetail } from "../types";

export const locationsQueryKeys = {
  all: ["locations"] as const,
  list: () => [...locationsQueryKeys.all, "list"] as const,
  detail: (id: string) => [...locationsQueryKeys.all, "detail", id] as const,
};

export const useLocationsQuery = (params: LocationsListParams = {}) =>
  useQuery<PaginatedResponse<Location>>({
    queryKey: [...locationsQueryKeys.list(), params],
    queryFn: () => locationsApi.getLocations(params),
    placeholderData: keepPreviousData,
  });

export const useLocationByIdQuery = (id: string | undefined, enabled = true) =>
  useQuery<LocationDetail>({
    queryKey: locationsQueryKeys.detail(id ?? ""),
    queryFn: () => locationsApi.getLocationById(id!),
    enabled: Boolean(id) && enabled,
  });
