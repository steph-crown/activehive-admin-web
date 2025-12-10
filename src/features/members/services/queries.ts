import { useQuery } from "@tanstack/react-query";
import { membersApi } from "./api";
import type { Member } from "../types";

export const membersQueryKeys = {
  all: ["members"] as const,
  list: () => [...membersQueryKeys.all, "list"] as const,
};

export const useMembersQuery = () =>
  useQuery<Member[]>({
    queryKey: membersQueryKeys.list(),
    queryFn: () => membersApi.getMembers(),
  });
