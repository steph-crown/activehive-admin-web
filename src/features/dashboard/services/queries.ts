import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";
import type { RecentActivity } from "../types";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  documents: () => [...dashboardQueryKeys.all, "documents"] as const,
};

export const useDashboardDocumentsQuery = () =>
  useQuery<RecentActivity[]>({
    queryKey: dashboardQueryKeys.documents(),
    queryFn: () => dashboardApi.getRecentActivities(),
  });
