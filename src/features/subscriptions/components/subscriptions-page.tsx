import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import {
  rowMatchesDateField,
  rowMatchesSearch,
} from "@/lib/table-filters";
import { useSubscriptionPlansQuery, useSubscriptionsQuery } from "../services";
import type { Subscription, SubscriptionPlan } from "../types";
import { SubscriptionsTable } from "./subscriptions-table";
import { SubscriptionPlansTable } from "./subscription-plans-table";
import { CreateSubscriptionPlanDialog } from "./create-subscription-plan-dialog";
import { EditSubscriptionPlanDialog } from "./edit-subscription-plan-dialog";
import { ConfirmDeleteSubscriptionPlanDialog } from "./confirm-delete-subscription-plan-dialog";

type Audience = "gym_owner" | "trainer";
type View = "subscriptions" | "plans";

const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "cancelled", label: "Cancelled" },
  { value: "trialing", label: "Trialing" },
  { value: "past_due", label: "Past due" },
  { value: "expired", label: "Expired" },
];

const PLAN_ACTIVE_OPTIONS = [
  { value: "all", label: "All plans" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function SubscriptionsPage() {
  const { data, isLoading, error } = useSubscriptionsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  const [deletePlan, setDeletePlan] = useState<SubscriptionPlan | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] =
    useState("all");
  const [planActiveFilter, setPlanActiveFilter] = useState("all");
  const [planBillingFilter, setPlanBillingFilter] = useState("all");

  const audience: Audience = useMemo(() => {
    const value = searchParams.get("audience");
    return value === "trainer" ? "trainer" : "gym_owner";
  }, [searchParams]);

  const view: View = useMemo(() => {
    const value = searchParams.get("view");
    return value === "plans" ? "plans" : "subscriptions";
  }, [searchParams]);

  const {
    data: plans,
    isLoading: plansLoading,
    error: plansError,
  } = useSubscriptionPlansQuery(audience);

  const handleAudienceChange = (next: string) => {
    const nextAudience = next === "trainer" ? "trainer" : "gym_owner";
    const params = new URLSearchParams(searchParams);
    params.set("audience", nextAudience);
    setSearchParams(params);
  };

  const handleViewChange = (next: string) => {
    const nextView = next === "plans" ? "plans" : "subscriptions";
    const params = new URLSearchParams(searchParams);
    params.set("view", nextView);
    setSearchParams(params);
  };

  const baseSubscriptions =
    audience === "gym_owner" && data ? data : ([] as Subscription[]);

  const filteredSubscriptions = useMemo(() => {
    return baseSubscriptions.filter((row) => {
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
    baseSubscriptions,
    searchQuery,
    dateFilter,
    subscriptionStatusFilter,
  ]);

  const billingOptions = useMemo(() => {
    const periods = new Set<string>();
    for (const p of plans ?? []) {
      if (p.billingPeriod) periods.add(p.billingPeriod);
    }
    const sorted = [...periods].sort();
    return [
      { value: "all", label: "All billing periods" },
      ...sorted.map((b) => ({
        value: b,
        label: b.replace(/_/g, " "),
      })),
    ];
  }, [plans]);

  const filteredPlans = useMemo(() => {
    return (plans ?? []).filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (planActiveFilter === "active" && !row.isActive) return false;
      if (planActiveFilter === "inactive" && row.isActive) return false;
      if (
        planBillingFilter !== "all" &&
        row.billingPeriod?.toLowerCase() !== planBillingFilter.toLowerCase()
      ) {
        return false;
      }
      return true;
    });
  }, [plans, searchQuery, planActiveFilter, planBillingFilter]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="space-y-4 px-4 lg:px-6">
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-3xl font-bold">Subscriptions</h1>
                  {view === "plans" && (
                    <Button size="sm" onClick={() => setCreateOpen(true)}>
                      New Subscription Plan
                    </Button>
                  )}
                </div>

                <CreateSubscriptionPlanDialog
                  open={createOpen}
                  onOpenChange={setCreateOpen}
                  initialPlanType={audience}
                />
                <EditSubscriptionPlanDialog
                  plan={editPlan}
                  open={editPlan != null}
                  onOpenChange={(open) => !open && setEditPlan(null)}
                />
                <ConfirmDeleteSubscriptionPlanDialog
                  plan={deletePlan}
                  open={deletePlan != null}
                  onOpenChange={(open) => !open && setDeletePlan(null)}
                />

                <Tabs
                  value={audience}
                  onValueChange={handleAudienceChange}
                  className="w-full"
                >
                  <TabsList>
                    <TabsTrigger value="gym_owner">Gym Owners</TabsTrigger>
                    <TabsTrigger value="trainer">Trainers</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Tabs
                  value={view}
                  onValueChange={handleViewChange}
                  className="w-full"
                >
                  <TabsList className="mt-2">
                    <TabsTrigger value="subscriptions">
                      Subscriptions
                    </TabsTrigger>
                    <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
                  </TabsList>

                  <TableFilterBar
                    className="mt-4"
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder={
                      view === "subscriptions"
                        ? "Search subscriptions..."
                        : "Search plans..."
                    }
                    dateValue={dateFilter}
                    onDateChange={setDateFilter}
                    extraFilters={
                      view === "subscriptions" ? (
                        <TableFilterSelect
                          value={subscriptionStatusFilter}
                          onValueChange={setSubscriptionStatusFilter}
                          placeholder="Status"
                          options={SUBSCRIPTION_STATUS_OPTIONS}
                          aria-label="Filter by subscription status"
                        />
                      ) : (
                        <>
                          <TableFilterSelect
                            value={planActiveFilter}
                            onValueChange={setPlanActiveFilter}
                            placeholder="Plan status"
                            options={PLAN_ACTIVE_OPTIONS}
                            aria-label="Filter by plan active state"
                          />
                          <TableFilterSelect
                            value={planBillingFilter}
                            onValueChange={setPlanBillingFilter}
                            placeholder="Billing"
                            options={billingOptions}
                            aria-label="Filter by billing period"
                          />
                        </>
                      )
                    }
                  />

                  <TabsContent value="subscriptions" className="mt-4">
                    {isLoading ? (
                      <TableCardSkeleton rows={7} columns={5} />
                    ) : error ? (
                      <div className="text-destructive">
                        Error loading subscriptions. Check console for details.
                      </div>
                    ) : (
                      <SubscriptionsTable data={filteredSubscriptions} />
                    )}
                  </TabsContent>

                  <TabsContent value="plans" className="mt-4">
                    {plansLoading ? (
                      <TableCardSkeleton rows={7} columns={5} />
                    ) : plansError ? (
                      <div className="text-destructive">
                        Error loading subscription plans. Check console for
                        details.
                      </div>
                    ) : (
                      <SubscriptionPlansTable
                        data={filteredPlans}
                        onEditPlan={(plan) => setEditPlan(plan)}
                        onDeletePlan={(plan) => setDeletePlan(plan)}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
