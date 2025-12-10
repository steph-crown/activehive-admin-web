import { useQuery } from "@tanstack/react-query";
import { usersApi } from "./api";
import type { User } from "../types";

export const usersQueryKeys = {
  all: ["users"] as const,
  list: () => [...usersQueryKeys.all, "list"] as const,
};

export const useUsersQuery = () =>
  useQuery<User[]>({
    queryKey: usersQueryKeys.list(),
    queryFn: () => usersApi.getUsers(),
  });
