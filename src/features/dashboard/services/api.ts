import { apiClient } from "@/lib/api-client";
import type { DashboardDocument } from "../types";
import mockData from "./data.json";

const basePath = "/dashboard/documents";

export const dashboardApi = {
  getDocuments: async (): Promise<DashboardDocument[]> => {
    try {
      return await apiClient.get<DashboardDocument[]>(basePath);
    } catch {
      return mockData;
    }
  },
};
