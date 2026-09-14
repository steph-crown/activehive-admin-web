import { useMemo, useState } from "react";
import {
  IconActivity,
  IconCircleCheckFilled,
  IconCreditCard,
  IconX,
} from "@tabler/icons-react";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import {
  mergeSectionMetricCssVars,
  SectionMetricCard,
} from "@/features/dashboard/components/section-metric-card";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useSubscriptionsQuery, useSubscriptionStatsQuery } from "../services";
import type { SubscriptionsListParams } from "../services/api";
import type { Subscription } from "../types";
import { SubscriptionsTable } from "./subscriptions-table";

const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
];

const SUBSCRIBER_TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "gym_owner", label: "Gym owners" },
  { value: "trainer", label: "Trainers" },
];

const METRIC_BASE_VARS = {
  "--success-500": "#22c55e",
  "--error-400": "#dc5959",
  "--grey-500": "#959595",
} as Record<string, string>;

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
    useState("active");
  const [subscriberTypeFilter, setSubscriberTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const apiParams = useMemo<SubscriptionsListParams>(() => {
    const params: SubscriptionsListParams = { page, limit };
    if (searchQuery) params.search = searchQuery;
    params.status = subscriptionStatusFilter;
    if (dateFilter) params.dateFrom = dateFilter;
    return params;
  }, [page, limit, searchQuery, subscriptionStatusFilter, dateFilter]);

  const { data: response, isLoading, error } = useSubscriptionsQuery(apiParams);
  const { data: stats } = useSubscriptionStatsQuery();

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

                <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                  <SectionMetricCard
                    title="Total subscriptions"
                    value={stats ? String(stats.total) : "—"}
                    icon={<IconCreditCard className="size-6" />}
                    iconBgVar="var(--blue-50)"
                    iconColorVar="var(--blue-500)"
                    percentChange={0}
                    isPositive
                    comparisonText="all time"
                    hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(59,130,246,0.22)]"
                    style={mergeSectionMetricCssVars({
                      ...METRIC_BASE_VARS,
                      "--blue-50": "#eff6ff",
                      "--blue-500": "#3b82f6",
                    })}
                  />
                  <SectionMetricCard
                    title="Active"
                    value={stats ? String(stats.active) : "—"}
                    icon={<IconCircleCheckFilled className="size-6" />}
                    iconBgVar="var(--success-50)"
                    iconColorVar="var(--success-500)"
                    percentChange={0}
                    isPositive
                    comparisonText="currently active"
                    hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(34,197,94,0.22)]"
                    style={mergeSectionMetricCssVars({
                      ...METRIC_BASE_VARS,
                      "--success-50": "#ecfdf3",
                    })}
                  />
                  <SectionMetricCard
                    title="Cancelled"
                    value={stats ? String(stats.cancelled) : "—"}
                    icon={<IconX className="size-6" />}
                    iconBgVar="var(--error-50)"
                    iconColorVar="var(--error-400)"
                    percentChange={0}
                    isPositive={false}
                    comparisonText="cancelled"
                    hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(220,89,89,0.22)]"
                    style={mergeSectionMetricCssVars({
                      ...METRIC_BASE_VARS,
                      "--error-50": "#fff0f0",
                    })}
                  />
                  <SectionMetricCard
                    title="Trial / Expired"
                    value={stats ? String(stats.trialOrExpired) : "—"}
                    icon={<IconActivity className="size-6" />}
                    iconBgVar="var(--amber-50)"
                    iconColorVar="var(--amber-500)"
                    percentChange={0}
                    isPositive={false}
                    comparisonText="trial or expired"
                    hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(245,158,11,0.22)]"
                    style={mergeSectionMetricCssVars({
                      ...METRIC_BASE_VARS,
                      "--amber-50": "#fffbeb",
                      "--amber-500": "#f59e0b",
                    })}
                  />
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
