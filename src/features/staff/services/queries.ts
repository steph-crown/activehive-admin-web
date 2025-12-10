import { useQuery } from "@tanstack/react-query";
import { staffApi } from "./api";

export const staffQueryKeys = {
  all: ["staff"] as const,
  list: () => [...staffQueryKeys.all, "list"] as const,
};

export const useStaffQuery = () =>
  useQuery({
    queryKey: staffQueryKeys.list(),
    queryFn: () => staffApi.getStaff(),
  });
