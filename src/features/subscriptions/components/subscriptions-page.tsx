import { useMemo, useState } from "react";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useSubscriptionsQuery } from "../services";
import type { SubscriptionsListParams } from "../services/api";
import type { Subscription } from "../types";
import { SubscriptionsTable } from "./subscriptions-table";

const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "cancelled", label: "Cancelled" },
  { value: "trialing", label: "Trialing" },
  { value: "past_due", label: "Past due" },
  { value: "expired", label: "Expired" },
];

const SUBSCRIBER_TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "gym_owner", label: "Gym owners" },
  { value: "trainer", label: "Trainers" },
];

function matchesSubscriberType(row: Subscription, filter: string): boolean {
  if (filter === "all") return true;
  const hasTrainer = row.trainerId != null && String(row.trainerId).trim() !== "";
  if (filter === "trainer") return hasTrainer;
  if (filter === "gym_owner") return !hasTrainer;
  return true;
}

export function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] =
    useState("all");
  const [subscriberTypeFilter, setSubscriberTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const apiParams = useMemo<SubscriptionsListParams>(() => {
    const params: SubscriptionsListParams = { page, limit };
    if (searchQuery) params.search = searchQuery;
    if (subscriptionStatusFilter !== "all")
      params.status = subscriptionStatusFilter;
    if (dateFilter) params.dateFrom = dateFilter;
    return params;
  }, [page, limit, searchQuery, subscriptionStatusFilter, dateFilter]);

  const { data: response, isLoading, error } = useSubscriptionsQuery(apiParams);

  // subscriberTypeFilter has no API support — applied client-side on current page.
  const filteredSubscriptions = useMemo(() => {
    const list = response?.data ?? [];
    return list.filter((row) => matchesSubscriberType(row, subscriberTypeFilter));
  }, [response, subscriberTypeFilter]);

  const pageCount = response?.pagination.totalPages;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="space-y-4 px-4 lg:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">Subscriptions</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Monitor platform subscriptions for gym owners and trainers.
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <TableCardSkeleton rows={7} columns={5} />
                ) : error ? (
                  <div className="text-destructive">
                    Error loading subscriptions. Check console for details.
                  </div>
                ) : (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={(v) => {
                        setSearchQuery(v);
                        setPage(1);
                      }}
                      searchPlaceholder="Search subscriptions..."
                      dateValue={dateFilter}
                      onDateChange={(v) => {
                        setDateFilter(v);
                        setPage(1);
                      }}
                      extraFilters={
                        <>
                          <TableFilterSelect
                            value={subscriberTypeFilter}
                            onValueChange={setSubscriberTypeFilter}
                            placeholder="Subscriber type"
                            options={SUBSCRIBER_TYPE_OPTIONS}
                            aria-label="Filter by gym owner or trainer"
                          />
                          <TableFilterSelect
                            value={subscriptionStatusFilter}
                            onValueChange={(v) => {
                              setSubscriptionStatusFilter(v);
                              setPage(1);
                            }}
                            placeholder="Status"
                            options={SUBSCRIPTION_STATUS_OPTIONS}
                            aria-label="Filter by subscription status"
                          />
                        </>
                      }
                    />
                    <div className="mt-4">
                      <SubscriptionsTable
                        data={filteredSubscriptions}
                        pageIndex={page - 1}
                        pageCount={pageCount}
                        onPageChange={(pageIndex, pageSize) => {
                          setPage(pageIndex + 1);
                          setLimit(pageSize);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
