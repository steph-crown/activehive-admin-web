import { useQuery } from "@tanstack/react-query";
import { adminsApi } from "./api";
import type { Admin } from "../types";

export const adminsQueryKeys = {
  all: ["admins"] as const,
  list: () => [...adminsQueryKeys.all, "list"] as const,
};

export const useAdminsQuery = () =>
  useQuery<Admin[]>({
    queryKey: adminsQueryKeys.list(),
    queryFn: () => adminsApi.getAdmins(),
  });
