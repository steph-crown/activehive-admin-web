import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";
import type { DashboardStats, RecentActivity } from "../types";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  documents: () => [...dashboardQueryKeys.all, "documents"] as const,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
};

export const useDashboardDocumentsQuery = () =>
  useQuery<RecentActivity[]>({
    queryKey: dashboardQueryKeys.documents(),
    queryFn: () => dashboardApi.getRecentActivities(),
  });

export const useDashboardStatsQuery = () =>
  useQuery<DashboardStats>({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: () => dashboardApi.getStats(),
  });
