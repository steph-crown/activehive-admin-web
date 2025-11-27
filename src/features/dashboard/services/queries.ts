import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";
import type { DashboardDocument } from "../types";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  documents: () => [...dashboardQueryKeys.all, "documents"] as const,
};

export const useDashboardDocumentsQuery = () =>
  useQuery<DashboardDocument[]>({
    queryKey: dashboardQueryKeys.documents(),
    queryFn: () => dashboardApi.getDocuments(),
  });
