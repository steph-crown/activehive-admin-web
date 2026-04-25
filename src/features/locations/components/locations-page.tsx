import { useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { rowMatchesDateField } from "@/lib/table-filters";
import { useLocationsQuery } from "../services";
import type { LocationsListParams } from "../services/api";
import type { Location } from "../types";
import { LocationDetailsDialog } from "./location-details-dialog";
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
  const [detailsLocationId, setDetailsLocationId] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const apiParams = useMemo<LocationsListParams>(() => {
    const params: LocationsListParams = { page, limit };
    if (searchQuery) params.search = searchQuery;
    if (activeFilter === "active") params.isActive = true;
    if (activeFilter === "inactive") params.isActive = false;
    return params;
  }, [page, limit, searchQuery, activeFilter]);

  const { data: response, isLoading, error } = useLocationsQuery(apiParams);

  // dateFilter and hqFilter have no API support — applied client-side on current page.
  const filteredData = useMemo(() => {
    const locations = response?.data ?? [];
    return locations.filter((row) => {
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      if (hqFilter === "hq" && !row.isHeadquarters) return false;
      if (hqFilter === "branch" && row.isHeadquarters) return false;
      return true;
    });
  }, [response, dateFilter, hqFilter]);

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
                  <h1 className="text-3xl font-bold">Locations</h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Manage gym locations, branches, and headquarters settings.
                  </p>
                </div>

                <LocationDetailsDialog
                  locationId={detailsLocationId}
                  open={detailsLocationId != null}
                  onOpenChange={(open) => {
                    if (!open) setDetailsLocationId(null);
                  }}
                />

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
                ) : response ? (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={(v) => {
                        setSearchQuery(v);
                        setPage(1);
                      }}
                      searchPlaceholder="Search locations..."
                      dateValue={dateFilter}
                      onDateChange={setDateFilter}
                      extraFilters={
                        <>
                          <TableFilterSelect
                            value={activeFilter}
                            onValueChange={(v) => {
                              setActiveFilter(v);
                              setPage(1);
                            }}
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
                      onViewDetails={(location) =>
                        setDetailsLocationId(location.id)
                      }
                      onActivateLocation={(location) =>
                        setStatusAction({ location, type: "activate" })
                      }
                      onDeactivateLocation={(location) =>
                        setStatusAction({ location, type: "deactivate" })
                      }
                      pageIndex={page - 1}
                      pageCount={pageCount}
                      onPageChange={(pageIndex, pageSize) => {
                        setPage(pageIndex + 1);
                        setLimit(pageSize);
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
