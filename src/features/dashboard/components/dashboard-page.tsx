import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table/data-table";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";
import { SectionCards } from "./section-cards";
import { RevenueChart } from "./revenue-chart";
import { MembersChart } from "./members-chart";
import { recentActivitiesColumns } from "./recent-activities-columns";
import { useDashboardDocumentsQuery } from "../services";
import {
  ChartsSkeleton,
  DashboardTableSkeleton,
  SectionCardsSkeleton,
} from "./dashboard-skeleton";
import {
  rowMatchesDateField,
  rowMatchesSearch,
} from "@/lib/table-filters";
import { useMemo, useState } from "react";
import type { RecentActivity } from "../types";

export function DashboardPage() {
  const { data, isLoading } = useDashboardDocumentsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const tableData = useMemo(() => data ?? [], [data]);

  const activityStatusOptions = useMemo(() => {
    const set = new Set(
      tableData.map((r: RecentActivity) => r.status.toLowerCase()),
    );
    return [
      { value: "all", label: "All statuses" },
      ...[...set].sort().map((s) => ({
        value: s,
        label: s.replace(/_/g, " "),
      })),
    ];
  }, [tableData]);

  const filteredActivities = useMemo(() => {
    return tableData.filter((row: RecentActivity) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.when, dateFilter)) return false;
      if (statusFilter !== "all" && row.status.toLowerCase() !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [tableData, searchQuery, dateFilter, statusFilter]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {isLoading ? (
                <>
                  <SectionCardsSkeleton />
                  <div className="px-4 lg:px-6">
                    <ChartsSkeleton />
                  </div>
                  <div className="px-4 lg:px-6">
                    <DashboardTableSkeleton />
                  </div>
                </>
              ) : (
                <>
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <RevenueChart />
                      <MembersChart />
                    </div>
                  </div>
                  <div className="px-4 lg:px-6">
                    <div className="w-full">
                      <div className="flex flex-col gap-6 !rounded-md border border-[#F4F4F4] bg-white p-8">
                        <h2 className="text-grey-900 text-lg font-semibold">
                          Recent activities
                        </h2>
                        <TableFilterBar
                          className="mt-4"
                          searchValue={searchQuery}
                          onSearchChange={setSearchQuery}
                          searchPlaceholder="Search activities..."
                          dateValue={dateFilter}
                          onDateChange={setDateFilter}
                          extraFilters={
                            <TableFilterSelect
                              value={statusFilter}
                              onValueChange={setStatusFilter}
                              placeholder="Status"
                              options={activityStatusOptions}
                              aria-label="Filter by activity status"
                            />
                          }
                        />
                        <DataTable
                          data={filteredActivities}
                          columns={recentActivitiesColumns}
                          enableDrag={false}
                          enableSelection={false}
                          getRowId={(row) => row.id.toString()}
                          emptyMessage="No recent activities."
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
