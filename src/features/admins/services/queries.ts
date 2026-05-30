import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminsApi } from "./api";
import type { AdminsListParams } from "./api";
import type { PaginatedResponse } from "@/lib/types";
import type { Admin } from "../types";

export const adminsQueryKeys = {
  all: ["admins"] as const,
  list: () => [...adminsQueryKeys.all, "list"] as const,
};

export const useAdminsQuery = (params: AdminsListParams = {}) =>
  useQuery<PaginatedResponse<Admin>>({
    queryKey: [...adminsQueryKeys.list(), params],
    queryFn: () => adminsApi.getAdmins(params),
    placeholderData: keepPreviousData,
  });
