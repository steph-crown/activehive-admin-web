import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { cn, formatDate } from "@/lib/utils";
import {
  useSubscriptionDetailQuery,
  useRenewalHistoryQuery,
} from "../services";

type SubscriptionDetailPageProps = {
  subscriptionId: string;
};

function LabeledField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "active":
      return "default";
    case "trial":
      return "secondary";
    case "cancelled":
    case "expired":
      return "destructive";
    default:
      return "outline";
  }
}

export function SubscriptionDetailPage({
  subscriptionId,
}: SubscriptionDetailPageProps) {
  const {
    data: sub,
    isLoading: subLoading,
    error: subError,
  } = useSubscriptionDetailQuery(subscriptionId);

  const { data: history, isLoading: historyLoading } =
    useRenewalHistoryQuery(subscriptionId);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Subscription details" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="space-y-6 px-4 lg:px-6">
                <div className="flex items-center gap-3">
                  <Link
                    to="/dashboard/subscriptions"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                    )}
                  >
                    <ArrowLeft className="mr-1 size-4" />
                    Back
                  </Link>
                  <h1 className="text-2xl font-semibold">
                    Subscription details
                  </h1>
                </div>

                {subLoading && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Card key={i} className="shadow-none">
                        <CardHeader>
                          <Skeleton className="h-5 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {subError && (
                  <Card className="border-destructive/30 bg-destructive/5 shadow-none">
                    <CardContent className="pt-6">
                      <p className="text-destructive text-sm">
                        Failed to load subscription.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        asChild
                      >
                        <Link to="/dashboard/subscriptions">
                          Back to subscriptions
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {sub && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="shadow-none">
                      <CardHeader>
                        <CardTitle className="text-base">Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-3 sm:grid-cols-2">
                        <LabeledField label="Status" value={
                          <Badge variant={statusVariant(sub.status)} className="capitalize">
                            {sub.status}
                          </Badge>
                        } />
                        <LabeledField label="Plan" value={sub.plan} />
                        <LabeledField
                          label="Monthly price"
                          value={
                            sub.monthlyPrice
                              ? `₦${Number(sub.monthlyPrice).toLocaleString()}`
                              : "—"
                          }
                        />
                        <LabeledField
                          label="Auto renew"
                          value={sub.autoRenew ? "Yes" : "No"}
                        />
                        <LabeledField
                          label="Trial"
                          value={sub.isTrial ? "Yes" : "No"}
                        />
                      </CardContent>
                    </Card>

                    <Card className="shadow-none">
                      <CardHeader>
                        <CardTitle className="text-base">Dates</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-3 sm:grid-cols-2">
                        <LabeledField
                          label="Trial start"
                          value={sub.trialStartDate ? formatDate(sub.trialStartDate) : "—"}
                        />
                        <LabeledField
                          label="Trial end"
                          value={sub.trialEndDate ? formatDate(sub.trialEndDate) : "—"}
                        />
                        <LabeledField
                          label="Subscription start"
                          value={sub.subscriptionStartDate ? formatDate(sub.subscriptionStartDate) : "—"}
                        />
                        <LabeledField
                          label="Subscription end"
                          value={sub.subscriptionEndDate ? formatDate(sub.subscriptionEndDate) : "—"}
                        />
                        <LabeledField
                          label="Last payment"
                          value={sub.lastPaymentDate ? formatDate(sub.lastPaymentDate) : "—"}
                        />
                        <LabeledField
                          label="Next payment"
                          value={sub.nextPaymentDate ? formatDate(sub.nextPaymentDate) : "—"}
                        />
                      </CardContent>
                    </Card>

                    {sub.gymOwner && (
                      <Card className="shadow-none">
                        <CardHeader>
                          <CardTitle className="text-base">Gym owner</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2">
                          <LabeledField
                            label="Name"
                            value={`${sub.gymOwner.firstName} ${sub.gymOwner.lastName}`.trim()}
                          />
                          <LabeledField label="Email" value={sub.gymOwner.email} />
                        </CardContent>
                      </Card>
                    )}

                    {sub.cancellationDate && (
                      <Card className="border-destructive/30 shadow-none">
                        <CardHeader>
                          <CardTitle className="text-base text-destructive">
                            Cancellation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2">
                          <LabeledField
                            label="Date"
                            value={formatDate(sub.cancellationDate)}
                          />
                          <LabeledField
                            label="Reason"
                            value={sub.cancellationReason?.trim() || "—"}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle className="text-base">Renewal history</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {historyLoading && (
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    )}
                    {!historyLoading && (!history || history.length === 0) && (
                      <p className="text-muted-foreground text-sm">
                        No renewal history yet.
                      </p>
                    )}
                    {!historyLoading && history && history.length > 0 && (
                      <div className="divide-y divide-[#F4F4F4]">
                        {history.map((entry) => (
                          <div
                            key={entry.id}
                            className="grid gap-2 py-3 text-sm sm:grid-cols-4"
                          >
                            <span className="text-muted-foreground text-xs">
                              {formatDate(entry.createdAt)}
                            </span>
                            <span>
                              {entry.previousPlan?.name ?? "—"}{" "}
                              <span className="text-muted-foreground">→</span>{" "}
                              {entry.newPlan?.name ?? "—"}
                            </span>
                            <span className="capitalize">
                              {entry.previousStatus}{" "}
                              <span className="text-muted-foreground">→</span>{" "}
                              {entry.newStatus}
                            </span>
                            <span>
                              {entry.amountPaid != null
                                ? `₦${Number(entry.amountPaid).toLocaleString()}`
                                : "—"}
                              {entry.promoCode && (
                                <span className="text-muted-foreground ml-2 text-xs">
                                  ({entry.promoCode})
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
