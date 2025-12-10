import { useQuery } from "@tanstack/react-query";
import { membershipsApi } from "./api";

export const membershipsQueryKeys = {
  all: ["memberships"] as const,
  list: () => [...membershipsQueryKeys.all, "list"] as const,
};

export const useMembershipsQuery = () =>
  useQuery({
    queryKey: membershipsQueryKeys.list(),
    queryFn: () => membershipsApi.getMemberships(),
  });
