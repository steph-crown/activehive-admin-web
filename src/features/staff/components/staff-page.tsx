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
import { useStaffQuery } from "../services";
import type { Staff } from "../types";
import { StaffTable } from "./staff-table";
import { ViewStaffDialog } from "./view-staff-dialog";
import { EditStaffDialog } from "./edit-staff-dialog";
import { ConfirmStaffActionDialog } from "./confirm-staff-action-dialog";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "gym_owner", label: "Gym owner" },
  { value: "member", label: "Member" },
  { value: "trainer", label: "Trainer" },
  { value: "staff", label: "Staff" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export function StaffPage() {
  const [viewStaff, setViewStaff] = useState<Staff | null>(null);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [action, setAction] = useState<{
    staff: Staff;
    action: "delete" | "activate" | "deactivate";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useStaffQuery();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      if (roleFilter !== "all") {
        if (row.role?.toLowerCase() !== roleFilter) return false;
      }
      if (statusFilter !== "all") {
        if (row.status?.toLowerCase() !== statusFilter) return false;
      }
      return true;
    });
  }, [data, searchQuery, dateFilter, roleFilter, statusFilter]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="mb-4 text-2xl font-bold">Staff</h1>

                <ViewStaffDialog
                  staff={viewStaff}
                  open={viewStaff != null}
                  onOpenChange={(open) => !open && setViewStaff(null)}
                />
                <EditStaffDialog
                  staff={editStaff}
                  open={editStaff != null}
                  onOpenChange={(open) => !open && setEditStaff(null)}
                />
                <ConfirmStaffActionDialog
                  staff={action?.staff ?? null}
                  action={action?.action ?? "deactivate"}
                  open={action != null}
                  onOpenChange={(open) => {
                    if (!open) {
                      setAction(null);
                    }
                  }}
                />

                {isLoading ? (
                  <TableCardSkeleton rows={8} columns={6} />
                ) : error ? (
                  <div className="text-destructive">
                    Error loading staff. Check console for details.
                  </div>
                ) : data ? (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={setSearchQuery}
                      searchPlaceholder="Search staff..."
                      dateValue={dateFilter}
                      onDateChange={setDateFilter}
                      extraFilters={
                        <>
                          <TableFilterSelect
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                            placeholder="Role"
                            options={ROLE_OPTIONS}
                            aria-label="Filter by role"
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
                    <StaffTable
                      data={filteredData}
                      onViewStaff={(staff) => setViewStaff(staff)}
                      onEditStaff={(staff) => setEditStaff(staff)}
                      onDeleteStaff={(staff) =>
                        setAction({ staff, action: "delete" })
                      }
                      onActivateStaff={(staff) =>
                        setAction({ staff, action: "activate" })
                      }
                      onDeactivateStaff={(staff) =>
                        setAction({ staff, action: "deactivate" })
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
