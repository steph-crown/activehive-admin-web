import { useMemo, useState } from "react";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { rowMatchesDateField, rowMatchesSearch } from "@/lib/table-filters";
import { IconPlus } from "@tabler/icons-react";
import { useSubscriptionPlansQuery } from "../services";
import type { SubscriptionPlan } from "../types";
import { SubscriptionPlansTable } from "./subscription-plans-table";
import { CreateSubscriptionPlanDialog } from "./create-subscription-plan-dialog";
import { EditSubscriptionPlanDialog } from "./edit-subscription-plan-dialog";
import { ConfirmDeleteSubscriptionPlanDialog } from "./confirm-delete-subscription-plan-dialog";

type Audience = "gym_owner" | "trainer";

const PLAN_ACTIVE_OPTIONS = [
  { value: "all", label: "All plans" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const AUDIENCE_OPTIONS = [
  { value: "gym_owner", label: "Gym owners" },
  { value: "trainer", label: "Trainers" },
];

export function SubscriptionPlansPage() {
  const [audience, setAudience] = useState<Audience>("gym_owner");
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  const [deletePlan, setDeletePlan] = useState<SubscriptionPlan | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [planActiveFilter, setPlanActiveFilter] = useState("all");
  const [planBillingFilter, setPlanBillingFilter] = useState("all");

  const {
    data: plans,
    isLoading: plansLoading,
    error: plansError,
  } = useSubscriptionPlansQuery(audience);

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
      const createdAt = (row as SubscriptionPlan & { createdAt?: string })
        .createdAt;
      if (!rowMatchesDateField(createdAt, dateFilter)) return false;
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
  }, [plans, searchQuery, dateFilter, planActiveFilter, planBillingFilter]);

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
                    <h1 className="text-3xl font-bold">Subscription plans</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Configure billing plans for gym owners and trainers.
                    </p>
                  </div>
                  <Button onClick={() => setCreateOpen(true)}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create Subscription
                  </Button>
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

                <TableFilterBar
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchPlaceholder="Search plans..."
                  dateValue={dateFilter}
                  onDateChange={setDateFilter}
                  extraFilters={
                    <>
                      <TableFilterSelect
                        value={audience}
                        onValueChange={(v) =>
                          setAudience(v === "trainer" ? "trainer" : "gym_owner")
                        }
                        placeholder="Plan audience"
                        options={AUDIENCE_OPTIONS}
                        aria-label="Filter plans by gym owner or trainer"
                      />
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
                  }
                />

                <div className="mt-4">
                  {plansLoading ? (
                    <TableCardSkeleton rows={7} columns={5} />
                  ) : plansError ? (
                    <div className="text-destructive">
                      Error loading subscription plans. Check console for details.
                    </div>
                  ) : (
                    <SubscriptionPlansTable
                      data={filteredPlans}
                      showPopularColumn={false}
                      onEditPlan={(plan) => setEditPlan(plan)}
                      onDeletePlan={(plan) => setDeletePlan(plan)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
