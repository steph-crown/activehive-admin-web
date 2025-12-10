import { useQuery } from "@tanstack/react-query";
import { locationsApi } from "./api";

export const locationsQueryKeys = {
  all: ["locations"] as const,
  list: () => [...locationsQueryKeys.all, "list"] as const,
};

export const useLocationsQuery = () =>
  useQuery({
    queryKey: locationsQueryKeys.list(),
    queryFn: () => locationsApi.getLocations(),
  });
