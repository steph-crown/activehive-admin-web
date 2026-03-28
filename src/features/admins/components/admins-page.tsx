import { useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { rowMatchesDateField, rowMatchesSearch } from "@/lib/table-filters";
import { useAdminsQuery } from "../services";
import type { Admin } from "../types";
import { AdminsTable } from "./admins-table";
import { CreateAdminDialog } from "./create-admin-dialog";
import { EditAdminDialog } from "./edit-admin-dialog";
import { ConfirmAdminActionDialog } from "./confirm-admin-action-dialog";

type AdminActionType = "delete" | "activate" | "deactivate";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export function AdminsPage() {
  const [viewAdmin, setViewAdmin] = useState<Admin | null>(null);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [actionAdmin, setActionAdmin] = useState<{
    admin: Admin;
    type: AdminActionType;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useAdminsQuery();

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
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">Admin Users</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Create, review, and manage system administrator accounts.
                    </p>
                  </div>
                  <CreateAdminDialog
                    viewAdmin={viewAdmin}
                    onViewClose={() => setViewAdmin(null)}
                  />
                </div>

                <EditAdminDialog
                  admin={editAdmin}
                  open={editAdmin != null}
                  onOpenChange={(open) => {
                    if (!open) setEditAdmin(null);
                  }}
                />
                <ConfirmAdminActionDialog
                  admin={actionAdmin?.admin ?? null}
                  action={actionAdmin?.type ?? "delete"}
                  open={actionAdmin != null}
                  onOpenChange={(open) => {
                    if (!open) setActionAdmin(null);
                  }}
                />

                {isLoading ? (
                  <TableCardSkeleton rows={8} columns={6} />
                ) : error ? (
                  <div className="text-destructive">
                    Error loading admins. Check console for details.
                  </div>
                ) : data ? (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={setSearchQuery}
                      searchPlaceholder="Search admins..."
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
                    <AdminsTable
                      data={filteredData}
                      onViewAdmin={(admin) => setViewAdmin(admin)}
                      onEditAdmin={(admin) => setEditAdmin(admin)}
                      onDeleteAdmin={(admin) =>
                        setActionAdmin({ admin, type: "delete" })
                      }
                      onActivateAdmin={(admin) =>
                        setActionAdmin({ admin, type: "activate" })
                      }
                      onDeactivateAdmin={(admin) =>
                        setActionAdmin({ admin, type: "deactivate" })
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
