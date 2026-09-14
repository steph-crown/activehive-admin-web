import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  IconCircleCheckFilled,
  IconLoader,
  IconX,
  IconClock,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  CardFieldsSkeleton,
  DetailTitleBadgeSkeleton,
} from "@/components/loader/page-skeleton";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { cn, formatDate } from "@/lib/utils";
import { useSubscriptionDetailQuery, useRenewalHistoryQuery } from "../services";
import type { SubscriptionRenewalHistory } from "../types";

type SubscriptionDetailPageProps = {
  subscriptionId: string;
};

function statusBadgeClass(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-emerald-600 hover:bg-emerald-600/90 text-white border-transparent";
    case "trial":
      return "bg-blue-500 hover:bg-blue-500/90 text-white border-transparent";
    case "pending":
      return "bg-amber-500 hover:bg-amber-500/90 text-white border-transparent";
    case "cancelled":
    case "expired":
      return "bg-destructive hover:bg-destructive/90 text-white border-transparent";
    default:
      return "bg-slate-500 hover:bg-slate-500/90 text-white border-transparent";
  }
}

function statusIcon(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return <IconCircleCheckFilled className="size-3.5 fill-white" />;
    case "trial":
      return <IconClock className="size-3.5 text-white" />;
    case "pending":
      return <IconLoader className="size-3.5 text-white" />;
    case "cancelled":
    case "expired":
      return <IconX className="size-3.5 text-white" />;
    default:
      return null;
  }
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="font-medium text-sm">{children ?? "—"}</div>
    </div>
  );
}

function DateVal({ date }: { date: string | null | undefined }) {
  if (!date) return <>—</>;
  return <>{formatDate(date)}</>;
}

export function SubscriptionDetailPage({ subscriptionId }: SubscriptionDetailPageProps) {
  const { data: sub, isLoading: subLoading, error: subError } =
    useSubscriptionDetailQuery(subscriptionId);

  const { data: history, isLoading: historyLoading } =
    useRenewalHistoryQuery(subscriptionId);

  const price = sub ? Number(sub.pricing.amount) : null;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 space-y-4">

                {/* Loading */}
                {subLoading && (
                  <>
                    <DetailTitleBadgeSkeleton />
                    <CardFieldsSkeleton fields={6} />
                    <CardFieldsSkeleton fields={5} />
                  </>
                )}

                {/* Error */}
                {subError && !subLoading && (
                  <p className="text-destructive text-sm">
                    Failed to load subscription. Please try again.
                  </p>
                )}

                {sub && !subLoading && (
                  <>
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <Link
                        to="/dashboard/subscriptions"
                        aria-label="Back to subscriptions"
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon", className: "mt-0.5 shrink-0" }),
                        )}
                      >
                        <ArrowLeft className="size-5" />
                      </Link>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-3xl font-bold">{sub.plan.name}</h1>
                          <Badge
                            variant="secondary"
                            className={cn("shrink-0 gap-1.5 capitalize", statusBadgeClass(sub.status))}
                          >
                            {statusIcon(sub.status)}
                            {sub.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {sub.owner.name} · {sub.owner.email}
                        </p>
                      </div>
                    </div>

                    {/* Subscription overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>Subscription and billing details.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 text-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <F label="Plan">{sub.plan.name}</F>
                          <F label="Status">
                            <Badge
                              variant="secondary"
                              className={cn("gap-1 capitalize", statusBadgeClass(sub.status))}
                            >
                              {statusIcon(sub.status)}
                              {sub.status}
                            </Badge>
                          </F>
                          <F label="Price">
                            {price != null && Number.isFinite(price)
                              ? `₦${price.toLocaleString()}`
                              : String(sub.pricing.amount)}{" "}
                            <span className="text-muted-foreground font-normal">
                              / {sub.pricing.billingPeriod}
                            </span>
                          </F>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <F label="Currency">{sub.pricing.currency}</F>
                          <F label="Auto renew">{sub.autoRenew ? "Yes" : "No"}</F>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Dates</CardTitle>
                        <CardDescription>Trial and subscription date timeline.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 text-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <F label="Trial start"><DateVal date={sub.trialStartDate} /></F>
                          <F label="Trial end"><DateVal date={sub.trialEndDate} /></F>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <F label="Subscription start"><DateVal date={sub.subscriptionStartDate} /></F>
                          <F label="Subscription end"><DateVal date={sub.subscriptionEndDate} /></F>
                          <F label="Next payment"><DateVal date={sub.nextPaymentDate} /></F>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Subscriber */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Subscriber</CardTitle>
                        <CardDescription>Owner and gym information.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 text-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <F label="Name">{sub.owner.name || "—"}</F>
                          <F label="Email">{sub.owner.email || "—"}</F>
                        </div>
                        {sub.gym?.name && sub.gym.name !== "N/A" && (
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <F label="Gym">{sub.gym.name}</F>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Cancellation */}
                    {sub.cancelledAt && (
                      <Card className="border-destructive/30">
                        <CardHeader>
                          <CardTitle className="text-destructive">Cancellation</CardTitle>
                          <CardDescription>This subscription has been cancelled.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 text-sm">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <F label="Cancelled on"><DateVal date={sub.cancelledAt} /></F>
                            <F label="Reason">{sub.cancellationReason?.trim() || "—"}</F>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Renewal history */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Renewal history</CardTitle>
                        <CardDescription>A record of all past renewals and plan changes.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {historyLoading && (
                          <CardFieldsSkeleton fields={3} />
                        )}
                        {!historyLoading && (!history || history.length === 0) && (
                          <p className="text-muted-foreground text-sm">No renewal history yet.</p>
                        )}
                        {!historyLoading && history && history.length > 0 && (
                          <div className="divide-y divide-border">
                            {history.map((entry) => (
                              <RenewalRow key={entry.id} entry={entry} />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
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

function RenewalRow({ entry }: { entry: SubscriptionRenewalHistory }) {
  return (
    <div className="py-3 grid grid-cols-[1fr_auto] gap-4 text-sm">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap font-medium">
          <span className="truncate">{entry.previousPlan?.name ?? "—"}</span>
          <span className="text-muted-foreground">→</span>
          <span className="truncate">{entry.newPlan?.name ?? "—"}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
          <span className="capitalize">{entry.previousStatus}</span>
          <span>→</span>
          <span className="capitalize">{entry.newStatus}</span>
          {entry.promoCode && (
            <Badge variant="secondary" className="text-xs font-normal">
              {entry.promoCode}
            </Badge>
          )}
        </div>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <p className="font-medium">
          {entry.amountPaid != null
            ? `₦${Number(entry.amountPaid).toLocaleString()}`
            : "—"}
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
      </div>
    </div>
  );
}
