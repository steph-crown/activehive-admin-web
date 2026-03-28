import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";
import { SectionCards } from "./section-cards";
import { RevenueChart } from "./revenue-chart";
import { MembersChart } from "./members-chart";
import { dashboardColumns } from "./dashboard-columns";
import { useDashboardDocumentsQuery } from "../services";
import type { DashboardDocument } from "../types";
import {
  ChartsSkeleton,
  DashboardTableSkeleton,
  SectionCardsSkeleton,
} from "./dashboard-skeleton";
import { useMemo, useState } from "react";

const dummyDashboardTableData: DashboardDocument[] = [
  {
    id: 1,
    header: "Membership renewals",
    type: "Compliance",
    status: "Done",
    target: "85",
    limit: "95",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Trainer onboarding docs",
    type: "Audit",
    status: "In Process",
    target: "70",
    limit: "90",
    reviewer: "Assign reviewer",
  },
  {
    id: 3,
    header: "Monthly attendance logs",
    type: "Operations",
    status: "Done",
    target: "92",
    limit: "98",
    reviewer: "Jamik Tashpulatov",
  },
];

export function DashboardPage() {
  const { isLoading } = useDashboardDocumentsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const tableData = useMemo(() => dummyDashboardTableData, []);

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
                    <div className="flex flex-col gap-6 !rounded-md border border-[#F4F4F4] bg-white p-8">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-grey-900 text-lg font-semibold">
                          Members
                        </h2>
                        <Input
                          type="text"
                          placeholder="Search by header, reviewer..."
                          className="h-10 w-full max-w-[280px]"
                          value={searchQuery}
                          onChange={(event) => setSearchQuery(event.target.value)}
                        />
                      </div>
                      <DataTable
                        data={tableData}
                        columns={dashboardColumns}
                        searchQuery={searchQuery}
                        enableDrag={false}
                        enableSelection={false}
                        getRowId={(row) => row.id.toString()}
                      />
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
