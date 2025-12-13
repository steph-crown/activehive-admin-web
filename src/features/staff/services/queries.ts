import { useQuery } from "@tanstack/react-query";
import { staffApi } from "./api";
import type { Staff } from "../types";

export const staffQueryKeys = {
  all: ["staff"] as const,
  list: () => [...staffQueryKeys.all, "list"] as const,
};

export const useStaffQuery = () =>
  useQuery<Staff[]>({
    queryKey: staffQueryKeys.list(),
    queryFn: () => staffApi.getStaff(),
  });
