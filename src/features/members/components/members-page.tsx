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
import { useMembersQuery } from "../services";
import type { Member } from "../types";
import { MembersTable } from "./members-table";
import { ViewMemberDialog } from "./view-member-dialog";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const VERIFIED_OPTIONS = [
  { value: "all", label: "All members" },
  { value: "verified", label: "Email verified" },
  { value: "unverified", label: "Email not verified" },
];

export function MembersPage() {
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  const { data, isLoading, error } = useMembersQuery();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      if (statusFilter !== "all") {
        if (row.status?.toLowerCase() !== statusFilter) return false;
      }
      if (verifiedFilter === "verified" && !row.isEmailVerified) return false;
      if (verifiedFilter === "unverified" && row.isEmailVerified) {
        return false;
      }
      return true;
    });
  }, [data, searchQuery, dateFilter, statusFilter, verifiedFilter]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="mb-4 text-3xl font-bold">Members</h1>

                <ViewMemberDialog
                  member={viewMember}
                  open={viewMember != null}
                  onOpenChange={(open) => !open && setViewMember(null)}
                />

                {isLoading ? (
                  <TableCardSkeleton rows={8} columns={6} />
                ) : error ? (
                  <div className="text-destructive">
                    Error loading members. Check console for details.
                  </div>
                ) : data ? (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={setSearchQuery}
                      searchPlaceholder="Search members..."
                      dateValue={dateFilter}
                      onDateChange={setDateFilter}
                      extraFilters={
                        <>
                          <TableFilterSelect
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                            placeholder="Status"
                            options={STATUS_OPTIONS}
                            aria-label="Filter by status"
                          />
                          <TableFilterSelect
                            value={verifiedFilter}
                            onValueChange={setVerifiedFilter}
                            placeholder="Email"
                            options={VERIFIED_OPTIONS}
                            aria-label="Filter by email verification"
                          />
                        </>
                      }
                    />
                    <MembersTable
                      data={filteredData}
                      onViewMember={(member) => setViewMember(member)}
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
