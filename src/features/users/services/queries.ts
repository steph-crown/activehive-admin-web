import { useQuery } from "@tanstack/react-query";
import { usersApi } from "./api";

export const usersQueryKeys = {
  all: ["users"] as const,
  list: () => [...usersQueryKeys.all, "list"] as const,
};

export const useUsersQuery = () =>
  useQuery({
    queryKey: usersQueryKeys.list(),
    queryFn: () => usersApi.getUsers(),
  });
