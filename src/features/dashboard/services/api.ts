import { apiClient } from "@/lib/api-client";
import type { DashboardStats, RecentActivity } from "../types";
import mockData from "./data.json";

const basePath = "/dashboard/recent-activities";
const statsPath = "/api/admin/dashboard/stats";

export const dashboardApi = {
  getRecentActivities: async (): Promise<RecentActivity[]> => {
    try {
      return await apiClient.get<RecentActivity[]>(basePath);
    } catch {
      return mockData as RecentActivity[];
    }
  },
  getStats: async (): Promise<DashboardStats> => {
    return await apiClient.get<DashboardStats>(statsPath);
  },
};
