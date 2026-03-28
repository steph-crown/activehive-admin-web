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
import { useGymOwnersQuery } from "../services";
import type { GymOwner } from "../types";
import { GymOwnersTable } from "./gym-owners-table";
import { ViewGymOwnerDialog } from "./view-gym-owner-dialog";
import { EditGymOwnerDialog } from "./edit-gym-owner-dialog";
import { ConfirmGymOwnerStatusDialog } from "./confirm-gym-owner-status-dialog";

type GymOwnerActionType = "activate" | "deactivate";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export function GymOwnersPage() {
  const [viewOwner, setViewOwner] = useState<GymOwner | null>(null);
  const [editOwner, setEditOwner] = useState<GymOwner | null>(null);
  const [statusAction, setStatusAction] = useState<{
    owner: GymOwner;
    type: GymOwnerActionType;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useGymOwnersQuery();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      if (statusFilter !== "all") {
        if (row.status?.toLowerCase() !== statusFilter) return false;
      }
      return true;
    });
  }, [data, searchQuery, dateFilter, statusFilter]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="mb-4 text-2xl font-bold">Gym Owners</h1>

                <ViewGymOwnerDialog
                  owner={viewOwner}
                  open={viewOwner != null}
                  onOpenChange={(open) => !open && setViewOwner(null)}
                />
                <EditGymOwnerDialog
                  owner={editOwner}
                  open={editOwner != null}
                  onOpenChange={(open) => {
                    if (!open) setEditOwner(null);
                  }}
                />
                <ConfirmGymOwnerStatusDialog
                  owner={statusAction?.owner ?? null}
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
                    Error loading gym owners. Check console for details.
                  </div>
                ) : data ? (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={setSearchQuery}
                      searchPlaceholder="Search gym owners..."
                      dateValue={dateFilter}
                      onDateChange={setDateFilter}
                      extraFilters={
                        <TableFilterSelect
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                          placeholder="Status"
                          options={STATUS_OPTIONS}
                          aria-label="Filter by status"
                        />
                      }
                    />
                    <GymOwnersTable
                      data={filteredData}
                      onViewOwner={(owner) => setViewOwner(owner)}
                      onEditOwner={(owner) => setEditOwner(owner)}
                      onActivateOwner={(owner) =>
                        setStatusAction({ owner, type: "activate" })
                      }
                      onDeactivateOwner={(owner) =>
                        setStatusAction({ owner, type: "deactivate" })
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
