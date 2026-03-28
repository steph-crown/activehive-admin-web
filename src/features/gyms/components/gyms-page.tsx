import { useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
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
import { useGymsQuery } from "../services";
import type { Gym } from "../types";
import { GymsTable } from "./gyms-table";
import { ConfirmGymStatusDialog } from "./confirm-gym-status-dialog";

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
  const [statusAction, setStatusAction] = useState<{
    gym: Gym;
    type: GymActionType;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data, isLoading, error } = useGymsQuery();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
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
      return true;
    });
  }, [data, searchQuery, dateFilter, approvalFilter, activeFilter]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="mb-4 text-3xl font-bold">Gyms</h1>

                <ConfirmGymStatusDialog
                  gym={statusAction?.gym ?? null}
                  action={statusAction?.type ?? "deactivate"}
                  open={statusAction != null}
                  onOpenChange={(open) => {
                    if (!open) setStatusAction(null);
                  }}
                />

                {isLoading ? (
                  <TableCardSkeleton rows={8} columns={6} />
                ) : error ? (
                  <div className="text-destructive">
                    Error loading gyms. Check console for details.
                  </div>
                ) : data ? (
                  <>
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
                        </>
                      }
                    />
                    <GymsTable
                      data={filteredData}
                      onActivateGym={(gym) =>
                        setStatusAction({ gym, type: "activate" })
                      }
                      onDeactivateGym={(gym) =>
                        setStatusAction({ gym, type: "deactivate" })
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
