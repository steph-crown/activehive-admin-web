import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import { SectionCardsSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import {
  rowMatchesDateField,
  rowMatchesSearch,
} from "@/lib/table-filters";
import { gymsQueryKeys, useGymsQuery } from "../services";
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

  const { data, isLoading, error } = useGymsQuery();

  const listRows = useMemo(
    () => (data ?? []).map(toGymListRow),
    [data],
  );

  const summary = useMemo(() => {
    const rows = listRows;
    const totalGyms = rows.length;
    const activeGyms = rows.filter((g) => g.isActive).length;
    const pendingApproval = rows.filter(
      (g) => g.approvalStatus === "pending",
    ).length;
    const totalMembers = rows.reduce(
      (sum, g) => sum + g.displayMemberTotal,
      0,
    );
    return { totalGyms, activeGyms, pendingApproval, totalMembers };
  }, [listRows]);

  const filteredData = useMemo(() => {
    return listRows.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      if (approvalFilter !== "all") {
        const current = row.approvalStatus;
        if (approvalFilter === "none") {
          if (current != null && String(current).length > 0) return false;
        } else if ((current ?? "").toLowerCase() !== approvalFilter) {
          return false;
        }
      }
      if (activeFilter === "active" && !row.isActive) return false;
      if (activeFilter === "inactive" && row.isActive) return false;
      if (planFilter !== "all" && row.displayPlanKey !== planFilter) {
        return false;
      }
      return true;
    });
  }, [
    listRows,
    searchQuery,
    dateFilter,
    approvalFilter,
    activeFilter,
    planFilter,
  ]);

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
                ) : data ? (
                  <>
                    <GymsSummaryCards
                      totalGyms={summary.totalGyms}
                      activeGyms={summary.activeGyms}
                      pendingApproval={summary.pendingApproval}
                      totalMembers={summary.totalMembers}
                    />
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={setSearchQuery}
                      searchPlaceholder="Search gyms..."
                      dateValue={dateFilter}
                      onDateChange={setDateFilter}
                      extraFilters={
                        <>
                          <TableFilterSelect
                            value={approvalFilter}
                            onValueChange={setApprovalFilter}
                            placeholder="Approval"
                            options={APPROVAL_OPTIONS}
                            aria-label="Filter by approval status"
                          />
                          <TableFilterSelect
                            value={activeFilter}
                            onValueChange={setActiveFilter}
                            placeholder="Gym status"
                            options={ACTIVE_OPTIONS}
                            aria-label="Filter by active state"
                          />
                          <TableFilterSelect
                            value={planFilter}
                            onValueChange={setPlanFilter}
                            placeholder="Plans"
                            options={GYM_PLAN_FILTER_OPTIONS}
                            aria-label="Filter by subscription plan"
                          />
                        </>
                      }
                    />
                    <GymsTable
                      data={filteredData}
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
