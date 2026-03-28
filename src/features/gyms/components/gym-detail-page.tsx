import { useMemo } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  IconBarbellFilled,
  IconCalendar,
  IconCircleCheckFilled,
  IconUserFilled,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StackedDetailSkeleton } from "@/components/loader/page-skeleton";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import {
  mergeSectionMetricCssVars,
  SectionMetricCard,
} from "@/features/dashboard/components/section-metric-card";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  gymsQueryKeys,
  useGymByIdQuery,
  useGymRegistrationStatusQuery,
} from "../services";
import { ConfirmGymStatusDialog } from "./confirm-gym-status-dialog";
import { GymApplicationFinalizeDialog } from "./gym-application-finalize-dialog";
import {
  GYM_DETAIL_TAB_ITEMS,
  GymDetailTabPanels,
} from "./gym-detail-tab-panels";
import type { Gym } from "../types";

function formatCityState(gym: Gym): string {
  const a = gym.address;
  if (!a) return "—";
  const city = a.city?.trim();
  const state = a.state?.trim();
  if (city && state) return `${city}, ${state}`;
  return [city, state].filter(Boolean).join(", ") || "—";
}

function planLabelFromSubscription(
  subscription: { isTrial: boolean; status: string } | null,
  fallback: string,
): string {
  if (!subscription) return fallback;
  if (subscription.isTrial) return "Trial";
  const s = subscription.status?.toLowerCase() ?? "";
  if (s.includes("basic")) return "Basic";
  if (s.includes("pro")) return "Pro";
  if (s.includes("enterprise")) return "Enterprise";
  return fallback;
}

type GymDetailPageProps = {
  gymId: string;
};

export function GymDetailPage({ gymId }: GymDetailPageProps) {
  const queryClient = useQueryClient();
  const [statusAction, setStatusAction] = useState<
    "activate" | "deactivate" | null
  >(null);
  const [finalize, setFinalize] = useState<{
    mode: "approve" | "reject";
  } | null>(null);

  const { data, isLoading, error } = useGymByIdQuery(gymId);
  const {
    data: registration,
    isLoading: registrationLoading,
  } = useGymRegistrationStatusQuery(gymId);

  const metricBaseVars = useMemo(
    () =>
      ({
        "--success-500": "#22c55e",
        "--error-400": "#dc5959",
        "--grey-500": "#959595",
      }) as Record<string, string>,
    [],
  );

  const gymKpiCards = useMemo(() => {
    if (!data) {
      return [];
    }
    const { gym } = data;
    const stats = registration?.stats;
    const totalMembers =
      typeof stats?.totalMembers === "number"
        ? stats.totalMembers
        : typeof gym.memberCount === "number"
          ? gym.memberCount
          : 198;
    const totalTrainers =
      typeof stats?.totalTrainers === "number" ? stats.totalTrainers : 12;
    const totalClasses = 24;
    const checkInsToday = 47;

    return [
      {
        title: "Total members",
        value: String(totalMembers),
        icon: <IconUserFilled className="size-6" />,
        iconBgVar: "var(--purple-50)",
        iconColorVar: "var(--purple-500)",
        hoverShadowClass:
          "hover:shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]",
        style: mergeSectionMetricCssVars({
          ...metricBaseVars,
          "--purple-50": "#f2eeff",
          "--purple-500": "#7e52ff",
        }),
      },
      {
        title: "Total trainers",
        value: String(totalTrainers),
        icon: <IconBarbellFilled className="size-6" />,
        iconBgVar: "var(--primary-50)",
        iconColorVar: "var(--primary-500)",
        hoverShadowClass:
          "hover:shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]",
        style: mergeSectionMetricCssVars({
          ...metricBaseVars,
          "--primary-50": "#ffefe6",
          "--primary-500": "#ff5b04",
        }),
      },
      {
        title: "Total classes",
        value: String(totalClasses),
        icon: <IconCalendar className="size-6" />,
        iconBgVar: "var(--sky-50)",
        iconColorVar: "var(--sky-500)",
        hoverShadowClass:
          "hover:shadow-[0_14px_30px_-20px_rgba(14,165,233,0.22)]",
        style: mergeSectionMetricCssVars({
          ...metricBaseVars,
          "--sky-50": "#e0f2fe",
          "--sky-500": "#0ea5e9",
        }),
      },
      {
        title: "Check-ins today",
        value: String(checkInsToday),
        icon: <IconCircleCheckFilled className="size-6" />,
        iconBgVar: "var(--success-50)",
        iconColorVar: "var(--success-500)",
        hoverShadowClass:
          "hover:shadow-[0_14px_30px_-20px_rgba(34,197,94,0.22)]",
        style: mergeSectionMetricCssVars({
          ...metricBaseVars,
          "--success-50": "#ecfdf3",
          "--success-500": "#22c55e",
        }),
      },
    ];
  }, [data, registration, metricBaseVars]);

  const invalidateGym = () => {
    void queryClient.invalidateQueries({ queryKey: gymsQueryKeys.list() });
    void queryClient.invalidateQueries({
      queryKey: gymsQueryKeys.detail(gymId),
    });
    void queryClient.invalidateQueries({
      queryKey: gymsQueryKeys.registrationStatus(gymId),
    });
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="space-y-6 px-4 lg:px-6">
                  <StackedDetailSkeleton
                    toolbar
                    cardCount={4}
                    cardFields={6}
                  />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !data) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="px-4 py-6 lg:px-6">
            <p className="text-destructive">
              Error loading gym.{" "}
              {error instanceof Error ? error.message : "Please try again."}
            </p>
            <Link
              to="/dashboard/gyms"
              className={cn(
                buttonVariants({ variant: "outline", className: "mt-4" }),
              )}
            >
              Back to Gyms
            </Link>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const { gym, locations, subscription } = data;

  const displayPlan =
    planLabelFromSubscription(subscription, "Basic") ||
    (gym as { subscriptionPlanName?: string | null }).subscriptionPlanName ||
    "Basic";

  const stats = registration?.stats;
  const totalMembers =
    typeof stats?.totalMembers === "number"
      ? stats.totalMembers
      : typeof gym.memberCount === "number"
        ? gym.memberCount
        : 198;
  const activeMembers =
    typeof stats?.activeMemberships === "number"
      ? stats.activeMemberships
      : typeof gym.activeMemberCount === "number"
        ? gym.activeMemberCount
        : 156;
  const totalTrainers =
    typeof stats?.totalTrainers === "number" ? stats.totalTrainers : 12;
  const totalClasses = 24;
  const checkInsToday = 47;
  const monthlyRevenueDisplay =
    gym.revenue && String(gym.revenue).trim()
      ? String(gym.revenue)
      : "$14,200";

  const subheading = `${formatCityState(gym)} · ${displayPlan}`;

  const canFinalize =
    registration &&
    registration.registration.status === "pending_approval" &&
    (registration.gym.approvalStatus === "pending" ||
      registration.gym.approvalStatus == null);

  const canToggleActive = gym.approvalStatus === "approved";

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="space-y-6 px-4 lg:px-6">
                <ConfirmGymStatusDialog
                  gym={statusAction ? gym : null}
                  action={statusAction ?? "deactivate"}
                  open={statusAction !== null}
                  onOpenChange={(open) => {
                    if (!open) setStatusAction(null);
                  }}
                />

                <GymApplicationFinalizeDialog
                  gymId={finalize ? gymId : null}
                  gymName={gym.name}
                  mode={finalize?.mode ?? null}
                  open={finalize !== null}
                  onOpenChange={(open) => {
                    if (!open) setFinalize(null);
                  }}
                  onFinalized={invalidateGym}
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Link
                      to="/dashboard/gyms"
                      aria-label="Back to gyms"
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                          size: "icon",
                          className: "mt-0.5 shrink-0",
                        }),
                      )}
                    >
                      <ArrowLeft className="size-5" />
                    </Link>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-3xl font-semibold ">
                          {gym.name}
                        </h1>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "shrink-0 border-transparent capitalize text-white",
                            (gym.approvalStatus == null ||
                              gym.approvalStatus === "pending") &&
                              "bg-amber-500 hover:bg-amber-500/90",
                            gym.approvalStatus === "approved" &&
                              "bg-emerald-600 hover:bg-emerald-600/90",
                            gym.approvalStatus === "rejected" &&
                              "bg-destructive hover:bg-destructive/90",
                          )}
                        >
                          {gym.approvalStatus === "pending" ||
                          gym.approvalStatus == null
                            ? "Pending review"
                            : gym.approvalStatus}
                        </Badge>
                        {gym.approvalStatus === "approved" && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "shrink-0 border-transparent text-white",
                              gym.isActive
                                ? "bg-emerald-600 hover:bg-emerald-600/90"
                                : "bg-slate-500 hover:bg-slate-500/90 dark:bg-slate-600 dark:hover:bg-slate-600/90",
                            )}
                          >
                            {gym.isActive ? "Active" : "Inactive"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {subheading}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {registrationLoading && (
                      <span className="text-muted-foreground text-xs">
                        Loading actions…
                      </span>
                    )}
                    {canFinalize && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFinalize({ mode: "reject" })}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setFinalize({ mode: "approve" })}
                        >
                          Approve
                        </Button>
                      </>
                    )}
                    {canToggleActive &&
                      (gym.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStatusAction("deactivate")}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setStatusAction("activate")}
                        >
                          Activate
                        </Button>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                  {gymKpiCards.map((card) => (
                    <SectionMetricCard
                      key={card.title}
                      title={card.title}
                      value={card.value}
                      icon={card.icon}
                      iconBgVar={card.iconBgVar}
                      iconColorVar={card.iconColorVar}
                      percentChange={0}
                      isPositive
                      comparisonText="vs last period"
                      hoverShadowClass={card.hoverShadowClass}
                      style={card.style}
                    />
                  ))}
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="bg-muted text-muted-foreground flex h-auto min-h-9 w-full flex-wrap justify-start gap-1 rounded-lg p-[3px]">
                    {GYM_DETAIL_TAB_ITEMS.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="gap-1.5 text-xs sm:text-sm"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <tab.icon className="size-4 shrink-0" />
                          {tab.label}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <GymDetailTabPanels
                    gym={gym}
                    locations={locations}
                    subscription={subscription}
                    planLabel={displayPlan}
                    metrics={{
                      totalMembers,
                      activeMembers,
                      totalTrainers,
                      totalClasses,
                      checkInsToday,
                      monthlyRevenueDisplay,
                    }}
                  />
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
