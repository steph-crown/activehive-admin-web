import { useQuery } from "@tanstack/react-query";
import { dashboardApi, type RecentActivitiesParams } from "./api";
import type { ChartDataPoint, DashboardStats, RecentActivity } from "../types";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  documents: (params: RecentActivitiesParams = {}) =>
    [...dashboardQueryKeys.all, "documents", params] as const,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
  gymsOverTime: () => [...dashboardQueryKeys.all, "gyms-over-time"] as const,
  participantsOverTime: () => [...dashboardQueryKeys.all, "participants-over-time"] as const,
};

export const useDashboardDocumentsQuery = (params: RecentActivitiesParams = {}) =>
  useQuery<RecentActivity[]>({
    queryKey: dashboardQueryKeys.documents(params),
    queryFn: () => dashboardApi.getRecentActivities(params),
  });

export const useDashboardStatsQuery = () =>
  useQuery<DashboardStats>({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: () => dashboardApi.getStats(),
  });

export const useGymsOverTimeQuery = () =>
  useQuery<ChartDataPoint[]>({
    queryKey: dashboardQueryKeys.gymsOverTime(),
    queryFn: () => dashboardApi.getGymsOverTime({ months: 12 }),
  });

export const useParticipantsOverTimeQuery = () =>
  useQuery<ChartDataPoint[]>({
    queryKey: dashboardQueryKeys.participantsOverTime(),
    queryFn: () => dashboardApi.getParticipantsOverTime({ months: 12 }),
  });
