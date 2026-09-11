import { useMemo, useState } from "react";
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
import { GymDetailPageSkeleton } from "@/components/loader/page-skeleton";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import {
  mergeSectionMetricCssVars,
  SectionMetricCard,
} from "@/features/dashboard/components/section-metric-card";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { formatMoneyDisplayAsNgn } from "@/lib/format-ngn";
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
import { formatGymRevenueFallbackForId } from "../lib/gym-list-display";
import type { Gym } from "../types";

const METRIC_BASE_VARS = {
  "--success-500": "#22c55e",
  "--error-400": "#dc5959",
  "--grey-500": "#959595",
} as Record<string, string>;

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

function GymPageShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="space-y-6 px-4 lg:px-6">{children}</div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
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

  const invalidateGym = () => {
    void queryClient.invalidateQueries({ queryKey: gymsQueryKeys.list() });
    void queryClient.invalidateQueries({
      queryKey: gymsQueryKeys.detail(gymId),
    });
    void queryClient.invalidateQueries({
      queryKey: gymsQueryKeys.registrationStatus(gymId),
    });
  };

  const stats = registration?.stats;

  const totalMembers = useMemo(() => {
    if (typeof data?.memberCount === "number") return data.memberCount;
    if (typeof stats?.totalMembers === "number") return stats.totalMembers;
    return 0;
  }, [data?.memberCount, stats?.totalMembers]);

  const activeMembers = useMemo(() => {
    if (typeof data?.activeMemberCount === "number") return data.activeMemberCount;
    if (typeof stats?.activeMemberships === "number") return stats.activeMemberships;
    return 0;
  }, [data?.activeMemberCount, stats?.activeMemberships]);

  const totalTrainers = typeof stats?.totalTrainers === "number" ? stats.totalTrainers : 0;
  const totalClasses = stats?.totalClasses ?? 0;
  const checkInsToday = stats?.checkInsToday ?? 0;

  const gymKpiCards = useMemo(() => {
    if (!data) return [];
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
          ...METRIC_BASE_VARS,
          "--purple-50": "#f2eeff",
          "--purple-500": "#7e52ff",
        }),
        bottomSlot: (
          <span
            className="text-xs font-medium"
            style={{ color: "var(--grey-500)" }}
          >
            {activeMembers} active members
          </span>
        ),
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
          ...METRIC_BASE_VARS,
          "--primary-50": "#ffefe6",
          "--primary-500": "#ff5b04",
        }),
        bottomSlot: undefined,
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
          ...METRIC_BASE_VARS,
          "--sky-50": "#e0f2fe",
          "--sky-500": "#0ea5e9",
        }),
        bottomSlot: undefined,
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
          ...METRIC_BASE_VARS,
          "--success-50": "#ecfdf3",
          "--success-500": "#22c55e",
        }),
        bottomSlot: undefined,
      },
    ];
  }, [data, totalMembers, activeMembers, totalTrainers, totalClasses, checkInsToday]);

  if (isLoading) {
    return (
      <GymPageShell>
        <GymDetailPageSkeleton />
      </GymPageShell>
    );
  }

  if (error || !data) {
    return (
      <GymPageShell>
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
      </GymPageShell>
    );
  }

  const { gym, locations, proposedLocations, subscription } = data;

  const displayPlan =
    planLabelFromSubscription(subscription, "Basic") ||
    gym.subscriptionPlanName ||
    "Basic";

  const monthlyRevenueDisplay =
    data.revenue && String(data.revenue).trim()
      ? formatMoneyDisplayAsNgn(data.revenue)
      : gym.revenue && String(gym.revenue).trim()
        ? formatMoneyDisplayAsNgn(gym.revenue)
        : formatGymRevenueFallbackForId(gym.id);

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
                      bottomSlot={card.bottomSlot}
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
                    proposedLocations={proposedLocations ?? []}
                    subscription={subscription}
                    planLabel={displayPlan}
                    registrationDocuments={
                      registration?.registration?.documents ?? null
                    }
                    registrationStatus={registration ?? null}
                    memberships={data.memberships ?? []}
                    trainers={gym.trainers}
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
