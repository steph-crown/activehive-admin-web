import { DataTable } from "@/components/data-table/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import {
  useDashboardDocumentsQuery,
  useDashboardStatsQuery,
} from "../services";
import { AppSidebar } from "./app-sidebar";
import {
  ChartsSkeleton,
  DashboardTableSkeleton,
  SectionCardsSkeleton,
} from "./dashboard-skeleton";
import { MembersChart } from "./members-chart";
import { recentActivitiesColumns } from "./recent-activities-columns";
import { RevenueChart } from "./revenue-chart";
import { SectionCards } from "./section-cards";
import { SiteHeader } from "./site-header";

export function DashboardPage() {
  const [searchQuery] = useState("");
  const [dateFilter] = useState("");

  const { data, isLoading } = useDashboardDocumentsQuery({
    search: searchQuery || undefined,
    dateFrom: dateFilter || undefined,
  });

  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {statsLoading ? (
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
                  <SectionCards stats={stats} />
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
                        {/* <TableFilterBar
                          className="mt-4"
                          searchValue={searchQuery}
                          onSearchChange={setSearchQuery}
                          searchPlaceholder="Search activities..."
                          dateValue={dateFilter}
                          onDateChange={setDateFilter}
                        /> */}
                        {isLoading ? (
                          <DashboardTableSkeleton />
                        ) : (
                          <DataTable
                            data={data ?? []}
                            columns={recentActivitiesColumns}
                            enableDrag={false}
                            enableSelection={false}
                            getRowId={(row) => row.id.toString()}
                            emptyMessage="No recent activities."
                          />
                        )}
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
