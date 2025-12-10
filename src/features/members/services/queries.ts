import { useQuery } from "@tanstack/react-query";
import { membersApi } from "./api";

export const membersQueryKeys = {
  all: ["members"] as const,
  list: () => [...membersQueryKeys.all, "list"] as const,
};

export const useMembersQuery = () =>
  useQuery({
    queryKey: membersQueryKeys.list(),
    queryFn: () => membersApi.getMembers(),
  });
