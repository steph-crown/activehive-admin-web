import { apiClient } from "@/lib/api-client";

const basePath = "/admin/users";

export const usersApi = {
  getUsers: async () => {
    return await apiClient.get(basePath);
  },
};
