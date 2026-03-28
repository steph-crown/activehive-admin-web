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
import { useLocationsQuery } from "../services";
import type { Location } from "../types";
import { LocationsTable } from "./locations-table";
import { ConfirmLocationStatusDialog } from "./confirm-location-status-dialog";

type LocationActionType = "activate" | "deactivate";

const ACTIVE_OPTIONS = [
  { value: "all", label: "All locations" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const HQ_OPTIONS = [
  { value: "all", label: "All sites" },
  { value: "hq", label: "Headquarters only" },
  { value: "branch", label: "Branches only" },
];

export function LocationsPage() {
  const [statusAction, setStatusAction] = useState<{
    location: Location;
    type: LocationActionType;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [hqFilter, setHqFilter] = useState("all");

  const { data, isLoading, error } = useLocationsQuery();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      if (activeFilter === "active" && !row.isActive) return false;
      if (activeFilter === "inactive" && row.isActive) return false;
      if (hqFilter === "hq" && !row.isHeadquarters) return false;
      if (hqFilter === "branch" && row.isHeadquarters) return false;
      return true;
    });
  }, [data, searchQuery, dateFilter, activeFilter, hqFilter]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="mb-4 text-3xl font-bold">Locations</h1>

                <ConfirmLocationStatusDialog
                  location={statusAction?.location ?? null}
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
                    Error loading locations. Check console for details.
                  </div>
                ) : data ? (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={setSearchQuery}
                      searchPlaceholder="Search locations..."
                      dateValue={dateFilter}
                      onDateChange={setDateFilter}
                      extraFilters={
                        <>
                          <TableFilterSelect
                            value={activeFilter}
                            onValueChange={setActiveFilter}
                            placeholder="Status"
                            options={ACTIVE_OPTIONS}
                            aria-label="Filter by active state"
                          />
                          <TableFilterSelect
                            value={hqFilter}
                            onValueChange={setHqFilter}
                            placeholder="Site type"
                            options={HQ_OPTIONS}
                            aria-label="Filter by headquarters"
                          />
                        </>
                      }
                    />
                    <LocationsTable
                      data={filteredData}
                      onActivateLocation={(location) =>
                        setStatusAction({ location, type: "activate" })
                      }
                      onDeactivateLocation={(location) =>
                        setStatusAction({ location, type: "deactivate" })
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
