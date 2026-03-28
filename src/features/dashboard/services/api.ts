import { apiClient } from "@/lib/api-client";
import type { RecentActivity } from "../types";
import mockData from "./data.json";

const basePath = "/dashboard/recent-activities";

export const dashboardApi = {
  getRecentActivities: async (): Promise<RecentActivity[]> => {
    try {
      return await apiClient.get<RecentActivity[]>(basePath);
    } catch {
      return mockData as RecentActivity[];
    }
  },
};
