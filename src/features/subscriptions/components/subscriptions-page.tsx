import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useSubscriptionPlansQuery, useSubscriptionsQuery } from "../services";
import type { SubscriptionPlan } from "../types";
import { SubscriptionsTable } from "./subscriptions-table";
import { SubscriptionPlansTable } from "./subscription-plans-table";
import { CreateSubscriptionPlanDialog } from "./create-subscription-plan-dialog";
import { EditSubscriptionPlanDialog } from "./edit-subscription-plan-dialog";
import { ConfirmDeleteSubscriptionPlanDialog } from "./confirm-delete-subscription-plan-dialog";

type Audience = "gym_owner" | "trainer";
type View = "subscriptions" | "plans";

export function SubscriptionsPage() {
  const { data, isLoading, error } = useSubscriptionsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  const [deletePlan, setDeletePlan] = useState<SubscriptionPlan | null>(null);

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

  if (data) {
    console.log("Subscriptions API Response:", data);
  }

  if (error) {
    console.error("Subscriptions API Error:", error);
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-2xl font-bold">Subscriptions</h1>
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

                {/* Audience selector: Gym Owners vs Trainers */}
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

                {/* Inner tabs: what to view for the current audience */}
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

                  <TabsContent value="subscriptions" className="mt-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <BlockLoader />
                      </div>
                    ) : error ? (
                      <div className="text-destructive">
                        Error loading subscriptions. Check console for details.
                      </div>
                    ) : (
                      <SubscriptionsTable
                        data={audience === "gym_owner" && data ? data : []}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="plans" className="mt-4">
                    {plansLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <BlockLoader />
                      </div>
                    ) : plansError ? (
                      <div className="text-destructive">
                        Error loading subscription plans. Check console for
                        details.
                      </div>
                    ) : (
                      <SubscriptionPlansTable
                        data={plans ?? []}
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
