import { apiClient } from "@/lib/api-client";
import type { User } from "../types";

const basePath = "/api/admin/users";

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    return await apiClient.get<User[]>(basePath);
  },
};
