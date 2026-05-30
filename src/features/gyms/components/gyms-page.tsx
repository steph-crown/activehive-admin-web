import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import { SectionCardsSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { gymsQueryKeys, useGymsQuery } from "../services";
import type { GymsListParams } from "../services/api";
import type { Gym } from "../types";
import {
  GYM_PLAN_FILTER_OPTIONS,
  toGymListRow,
  type GymListRow,
} from "../lib/gym-list-display";
import { GymsTable } from "./gyms-table";
import { ConfirmGymStatusDialog } from "./confirm-gym-status-dialog";
import { GymApplicationFinalizeDialog } from "./gym-application-finalize-dialog";
import { GymsSummaryCards } from "./gyms-summary-cards";

type GymActionType = "activate" | "deactivate";

const APPROVAL_OPTIONS = [
  { value: "all", label: "All approvals" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "none", label: "No approval" },
];

const ACTIVE_OPTIONS = [
  { value: "all", label: "All gyms" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function GymsPage() {
  const queryClient = useQueryClient();
  const [statusAction, setStatusAction] = useState<{
    gym: Gym;
    type: GymActionType;
  } | null>(null);
  const [finalizeApp, setFinalizeApp] = useState<{
    gym: GymListRow;
    mode: "approve" | "reject";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);

  const apiParams = useMemo<GymsListParams>(() => {
    const params: GymsListParams = { page, limit };
    if (searchQuery) params.search = searchQuery;
    if (approvalFilter !== "all") {
      params.approvalStatus = approvalFilter;
    }
    if (activeFilter === "active") params.isActive = true;
    if (activeFilter === "inactive") params.isActive = false;
    if (dateFilter) {
      params.dateFrom = dateFilter;
      params.dateTo = dateFilter;
    }
    if (planFilter !== "all") {
      params.subscriptionPlan = planFilter;
    }
    const activeSort = sorting[0];
    if (activeSort) {
      params.sort = activeSort.id;
      params.order = activeSort.desc ? "DESC" : "ASC";
    }
    return params;
  }, [
    page,
    limit,
    searchQuery,
    approvalFilter,
    activeFilter,
    dateFilter,
    planFilter,
    sorting,
  ]);

  const { data: response, isLoading, error } = useGymsQuery(apiParams);

  const listRows = useMemo(
    () => (response?.data ?? []).map(toGymListRow),
    [response],
  );

  const summary = useMemo(() => {
    const rows = listRows;
    const totalGyms = response?.pagination.total ?? rows.length;
    const activeGyms = rows.filter((g) => g.isActive).length;
    const pendingApproval = rows.filter(
      (g) => g.approvalStatus === "pending",
    ).length;
    const totalMembers = rows.reduce(
      (sum, g) => sum + g.displayMemberTotal,
      0,
    );
    return { totalGyms, activeGyms, pendingApproval, totalMembers };
  }, [listRows, response]);

  const pageCount = response?.pagination.totalPages;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold">Gyms</h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Browse registered gyms, approvals, and roster metrics in one
                    place.
                  </p>
                </div>

                <ConfirmGymStatusDialog
                  gym={statusAction?.gym ?? null}
                  action={statusAction?.type ?? "deactivate"}
                  open={statusAction != null}
                  onOpenChange={(open) => {
                    if (!open) setStatusAction(null);
                  }}
                />

                <GymApplicationFinalizeDialog
                  gymId={finalizeApp?.gym.id ?? null}
                  gymName={finalizeApp?.gym.name ?? ""}
                  mode={finalizeApp?.mode ?? null}
                  open={finalizeApp != null}
                  onOpenChange={(open) => {
                    if (!open) setFinalizeApp(null);
                  }}
                  onFinalized={() => {
                    void queryClient.invalidateQueries({
                      queryKey: gymsQueryKeys.list(),
                    });
                  }}
                />

                {isLoading ? (
                  <>
                    <SectionCardsSkeleton />
                    <TableCardSkeleton rows={8} columns={8} />
                  </>
                ) : error ? (
                  <div className="text-destructive">
                    Error loading gyms. Check console for details.
                  </div>
                ) : response ? (
                  <>
                    <GymsSummaryCards
                      totalGyms={summary.totalGyms}
                      activeGyms={summary.activeGyms}
                      pendingApproval={summary.pendingApproval}
                      totalMembers={summary.totalMembers}
                    />
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={(v) => {
                        setSearchQuery(v);
                        setPage(1);
                      }}
                      searchPlaceholder="Search gyms..."
                      dateValue={dateFilter}
                      onDateChange={(value) => {
                        setDateFilter(value);
                        setPage(1);
                      }}
                      extraFilters={
                        <>
                          <TableFilterSelect
                            value={approvalFilter}
                            onValueChange={(v) => {
                              setApprovalFilter(v);
                              setPage(1);
                            }}
                            placeholder="Approval"
                            options={APPROVAL_OPTIONS}
                            aria-label="Filter by approval status"
                          />
                          <TableFilterSelect
                            value={activeFilter}
                            onValueChange={(v) => {
                              setActiveFilter(v);
                              setPage(1);
                            }}
                            placeholder="Gym status"
                            options={ACTIVE_OPTIONS}
                            aria-label="Filter by active state"
                          />
                          <TableFilterSelect
                            value={planFilter}
                            onValueChange={(value) => {
                              setPlanFilter(value);
                              setPage(1);
                            }}
                            placeholder="Plans"
                            options={GYM_PLAN_FILTER_OPTIONS}
                            aria-label="Filter by subscription plan"
                          />
                        </>
                      }
                    />
                    <GymsTable
                      data={listRows}
                      onActivateGym={(gym: GymListRow) =>
                        setStatusAction({ gym, type: "activate" })
                      }
                      onDeactivateGym={(gym: GymListRow) =>
                        setStatusAction({ gym, type: "deactivate" })
                      }
                      onApproveApplication={(gym: GymListRow) =>
                        setFinalizeApp({ gym, mode: "approve" })
                      }
                      onRejectApplication={(gym: GymListRow) =>
                        setFinalizeApp({ gym, mode: "reject" })
                      }
                      pageIndex={page - 1}
                      pageCount={pageCount}
                      onPageChange={(pageIndex, pageSize) => {
                        setPage(pageIndex + 1);
                        setLimit(pageSize);
                      }}
                      sorting={sorting}
                      onSortingChange={(nextSorting) => {
                        setSorting(nextSorting);
                        setPage(1);
                      }}
                    />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
