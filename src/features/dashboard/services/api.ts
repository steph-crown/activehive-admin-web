import { apiClient } from "@/lib/api-client";
import type { ChartDataPoint, DashboardStats, RecentActivity } from "../types";
import mockData from "./data.json";

const basePath = "/api/admin/dashboard/recent-activities";
const statsPath = "/api/admin/dashboard/stats";
const gymsOverTimePath = "/api/admin/dashboard/charts/gyms-over-time";
const participantsOverTimePath = "/api/admin/dashboard/charts/participants-over-time";

export type RecentActivitiesParams = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type ChartParams = {
  months?: number;
  dateFrom?: string;
  dateTo?: string;
};

export const dashboardApi = {
  getRecentActivities: async (params: RecentActivitiesParams = {}): Promise<RecentActivity[]> => {
    try {
      const queryParams: Record<string, string> = {};
      if (params.search) queryParams.search = params.search;
      if (params.dateFrom) queryParams.dateFrom = params.dateFrom;
      if (params.dateTo) queryParams.dateTo = params.dateTo;
      return await apiClient.get<RecentActivity[]>(basePath, { params: queryParams });
    } catch {
      return mockData as RecentActivity[];
    }
  },
  getStats: async (): Promise<DashboardStats> => {
    return await apiClient.get<DashboardStats>(statsPath);
  },
  getGymsOverTime: async (params: ChartParams = {}): Promise<ChartDataPoint[]> => {
    const queryParams: Record<string, string | number> = { months: params.months ?? 12 };
    if (params.dateFrom) queryParams.dateFrom = params.dateFrom;
    if (params.dateTo) queryParams.dateTo = params.dateTo;
    return await apiClient.get<ChartDataPoint[]>(gymsOverTimePath, { params: queryParams });
  },
  getParticipantsOverTime: async (params: ChartParams = {}): Promise<ChartDataPoint[]> => {
    const queryParams: Record<string, string | number> = { months: params.months ?? 12 };
    if (params.dateFrom) queryParams.dateFrom = params.dateFrom;
    if (params.dateTo) queryParams.dateTo = params.dateTo;
    return await apiClient.get<ChartDataPoint[]>(participantsOverTimePath, { params: queryParams });
  },
};
