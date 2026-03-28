import { useMemo, useState } from "react";

import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { rowMatchesDateField, rowMatchesSearch } from "@/lib/table-filters";
import { DEMO_LEADERBOARDS } from "../data/demo-leaderboards";
import { LeaderboardsTable } from "./leaderboards-table";

const SCOPE_OPTIONS = [
  { value: "all", label: "All scopes" },
  { value: "platform", label: "Platform" },
  { value: "gym", label: "Gym" },
];

const METRIC_OPTIONS = [
  { value: "all", label: "All metrics" },
  { value: "points", label: "Points" },
  { value: "visits", label: "Visits" },
  { value: "classes", label: "Classes" },
];

const PERIOD_OPTIONS = [
  { value: "all", label: "All periods" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "all_time", label: "All time" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "live", label: "Live" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export function LeaderboardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [metricFilter, setMetricFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return DEMO_LEADERBOARDS.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.updatedAt, dateFilter)) return false;
      if (scopeFilter !== "all" && row.scope !== scopeFilter) return false;
      if (metricFilter !== "all" && row.metric !== metricFilter) return false;
      if (periodFilter !== "all" && row.period !== periodFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      return true;
    });
  }, [
    searchQuery,
    dateFilter,
    scopeFilter,
    metricFilter,
    periodFilter,
    statusFilter,
  ]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="space-y-4 px-4 lg:px-6">
                <div>
                  <h1 className="text-3xl font-bold">Leaderboards</h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Review competitive boards, scoring windows, and rollout
                    status across gyms and the platform.
                  </p>
                </div>

                <TableFilterBar
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchPlaceholder="Search leaderboards..."
                  dateValue={dateFilter}
                  onDateChange={setDateFilter}
                  extraFilters={
                    <>
                      <TableFilterSelect
                        value={scopeFilter}
                        onValueChange={setScopeFilter}
                        placeholder="Scope"
                        options={SCOPE_OPTIONS}
                        aria-label="Filter by leaderboard scope"
                      />
                      <TableFilterSelect
                        value={metricFilter}
                        onValueChange={setMetricFilter}
                        placeholder="Metric"
                        options={METRIC_OPTIONS}
                        aria-label="Filter by metric"
                      />
                      <TableFilterSelect
                        value={periodFilter}
                        onValueChange={setPeriodFilter}
                        placeholder="Period"
                        options={PERIOD_OPTIONS}
                        aria-label="Filter by period"
                      />
                      <TableFilterSelect
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                        placeholder="Status"
                        options={STATUS_OPTIONS}
                        aria-label="Filter by status"
                      />
                    </>
                  }
                />

                <div className="mt-4">
                  <LeaderboardsTable data={filtered} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
