import { useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import { TableFilterBar } from "@/components/molecules/table-filter-bar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import {
  rowMatchesDateField,
  rowMatchesSearch,
} from "@/lib/table-filters";
import { useMembershipsQuery } from "../services";
import { MembershipsTable } from "./memberships-table";

type MembershipRow = {
  id: string;
  createdAt?: string;
  [key: string]: unknown;
};

export function MembershipsPage() {
  const { data, isLoading, error } = useMembershipsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const rows = Array.isArray(data) ? (data as MembershipRow[]) : [];

  const filteredData = useMemo(() => {
    return rows.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      return true;
    });
  }, [rows, searchQuery, dateFilter]);

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
                  <h1 className="text-3xl font-bold">Memberships</h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Review membership records and plan assignments.
                  </p>
                </div>

                {isLoading ? (
                  <TableCardSkeleton rows={8} columns={6} />
                ) : error ? (
                  <div className="text-destructive">
                    Error loading memberships. Check console for details.
                  </div>
                ) : data ? (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={setSearchQuery}
                      searchPlaceholder="Search memberships..."
                      dateValue={dateFilter}
                      onDateChange={setDateFilter}
                    />
                    <MembershipsTable data={filteredData} />
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
