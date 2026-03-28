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
import { useSubscriptionsQuery } from "../services";
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

function matchesSubscriberType(
  row: Subscription,
  filter: string,
): boolean {
  if (filter === "all") return true;
  const hasTrainer = row.trainerId != null && String(row.trainerId).trim() !== "";
  if (filter === "trainer") return hasTrainer;
  if (filter === "gym_owner") return !hasTrainer;
  return true;
}

export function SubscriptionsPage() {
  const { data, isLoading, error } = useSubscriptionsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] =
    useState("all");
  const [subscriberTypeFilter, setSubscriberTypeFilter] = useState("all");

  const filteredSubscriptions = useMemo(() => {
    const list = data ?? [];
    return list.filter((row) => {
      if (!matchesSubscriberType(row, subscriberTypeFilter)) return false;
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      if (subscriptionStatusFilter !== "all") {
        const s = row.status?.toLowerCase() ?? "";
        const f = subscriptionStatusFilter.toLowerCase();
        const cancelled =
          f === "cancelled" && (s === "cancelled" || s === "canceled");
        if (!cancelled && s !== f) return false;
      }
      return true;
    });
  }, [
    data,
    subscriberTypeFilter,
    searchQuery,
    dateFilter,
    subscriptionStatusFilter,
  ]);

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
                      onSearchChange={setSearchQuery}
                      searchPlaceholder="Search subscriptions..."
                      dateValue={dateFilter}
                      onDateChange={setDateFilter}
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
                            onValueChange={setSubscriptionStatusFilter}
                            placeholder="Status"
                            options={SUBSCRIPTION_STATUS_OPTIONS}
                            aria-label="Filter by subscription status"
                          />
                        </>
                      }
                    />
                    <div className="mt-4">
                      <SubscriptionsTable data={filteredSubscriptions} />
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
