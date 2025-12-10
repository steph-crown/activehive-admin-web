import { apiClient } from "@/lib/api-client";
import type { Member } from "../types";

const basePath = "/api/admin/members";

export const membersApi = {
  getMembers: async (): Promise<Member[]> => {
    return await apiClient.get<Member[]>(basePath);
  },
};
