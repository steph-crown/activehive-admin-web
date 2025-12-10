import { useQuery } from "@tanstack/react-query";
import { locationsApi } from "./api";
import type { Location } from "../types";

export const locationsQueryKeys = {
  all: ["locations"] as const,
  list: () => [...locationsQueryKeys.all, "list"] as const,
};

export const useLocationsQuery = () =>
  useQuery<Location[]>({
    queryKey: locationsQueryKeys.list(),
    queryFn: () => locationsApi.getLocations(),
  });
