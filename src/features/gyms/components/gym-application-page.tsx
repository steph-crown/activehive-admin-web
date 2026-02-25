import { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Textarea } from "@/components/ui/textarea";
import { gymsApi, useGymRegistrationStatusQuery } from "../services";

export function GymApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const [finalizing, setFinalizing] = useState<"approved" | "rejected" | null>(
    null,
  );
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [reason, setReason] = useState("");
  const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false);
  const { data, isLoading, error, refetch } = useGymRegistrationStatusQuery(id);

  const handleFinalize = async (
    status: "approved" | "rejected",
    finalizeReason: string | undefined,
  ) => {
    if (!data) return;
    const approvalId =
      (data.registration.stepData?.["6"] as { approvalId?: string } | undefined)
        ?.approvalId;
    if (!approvalId) {
      showError("Error", "Missing approval ID for this application.");
      return;
    }

    try {
      setFinalizing(status);
      await gymsApi.finalizeGymApplication(approvalId, {
        status,
        reason: finalizeReason,
      });
      showSuccess(
        "Success",
        `Application ${status === "approved" ? "approved" : "rejected"} successfully`,
      );
      await refetch();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to finalize application.";
      showError("Error", message);
    } finally {
      setFinalizing(null);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center py-10">
            <BlockLoader />
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
          <div className="px-4 lg:px-6 py-6">
            <p className="text-destructive">
              Failed to load application.{" "}
              {error instanceof Error ? error.message : "Please try again."}
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const { gym, owner, registration, stats } = data;
  const canFinalize = registration.status === "pending_approval";

  const brandingStep = registration.stepData?.["2"] as
    | {
        logoPath?: string;
        primaryColor?: string;
        secondaryColor?: string;
      }
    | undefined;

  const locationsStep = registration.stepData?.["4"] as
    | {
        locations?: {
          city: string;
          state: string;
          address: string;
          country: string;
          zipCode: string;
          email: string;
          phone: string;
          locationName: string;
          isHeadquarters: boolean;
        }[];
        hasMultipleLocations?: boolean;
      }
    | undefined;

  const locations = locationsStep?.locations ?? [];

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
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold">
                      Review application — {gym.name}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Registration details for this gym and owner.
                    </p>
                  </div>
                  {canFinalize && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={finalizing !== null}
                        onClick={() => {
                          setDecision("rejected");
                          setReason("");
                          setIsReasonDialogOpen(true);
                        }}
                      >
                        Reject Application
                      </Button>
                      <Button
                        size="sm"
                        disabled={finalizing !== null}
                        onClick={() => {
                          setDecision("approved");
                          setReason("");
                          setIsReasonDialogOpen(true);
                        }}
                      >
                        Approve Application
                      </Button>
                    </div>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Gym</CardTitle>
                    <CardDescription>Gym profile information.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm">
                    <div className="flex items-start gap-4">
                      {(brandingStep?.logoPath || gym.logo) && (
                        <img
                          src={brandingStep?.logoPath ?? gym.logo ?? ""}
                          alt=""
                          className="size-16 rounded-lg object-cover border border-border"
                        />
                      )}
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Name</span>
                        <p className="font-medium">{gym.name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Email</span>
                        <p className="font-medium">{gym.email ?? "—"}</p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Phone</span>
                        <p className="font-medium">
                          {gym.phoneNumber ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Address</span>
                      <p className="font-medium">
                        {gym.address
                          ? `${gym.address.street}, ${gym.address.city}, ${gym.address.state}, ${gym.address.country}, ${gym.address.zipCode}`
                          : "—"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {brandingStep && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Branding</CardTitle>
                      <CardDescription>
                        Logo and primary brand colors.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Logo</span>
                        {(brandingStep.logoPath || gym.logo) ? (
                          <img
                            src={brandingStep.logoPath ?? gym.logo ?? ""}
                            alt=""
                            className="h-16 w-16 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <p className="font-medium">—</p>
                        )}
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">
                          Primary color
                        </span>
                        {brandingStep.primaryColor ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="h-6 w-6 rounded border border-border"
                              style={{
                                backgroundColor: brandingStep.primaryColor,
                              }}
                            />
                            <span className="font-mono text-xs">
                              {brandingStep.primaryColor}
                            </span>
                          </div>
                        ) : (
                          <p className="font-medium">—</p>
                        )}
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">
                          Secondary color
                        </span>
                        {brandingStep.secondaryColor ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="h-6 w-6 rounded border border-border"
                              style={{
                                backgroundColor: brandingStep.secondaryColor,
                              }}
                            />
                            <span className="font-mono text-xs">
                              {brandingStep.secondaryColor}
                            </span>
                          </div>
                        ) : (
                          <p className="font-medium">—</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Owner</CardTitle>
                    <CardDescription>Gym owner account details.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm">
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Name</span>
                      <p className="font-medium">
                        {owner.firstName} {owner.lastName}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Email</span>
                        <p className="font-medium">{owner.email}</p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Phone</span>
                        <p className="font-medium">
                          {owner.phoneNumber ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="capitalize w-fit">
                          {owner.status}
                        </Badge>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">
                          Email verified
                        </span>
                        <Badge variant={owner.isEmailVerified ? "default" : "secondary"}>
                          {owner.isEmailVerified ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">
                          Onboarding
                        </span>
                        <Badge
                          variant={
                            owner.onboardingCompleted ? "default" : "secondary"
                          }
                        >
                          {owner.onboardingCompleted ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Registration</CardTitle>
                    <CardDescription>
                      Application status and subscription summary.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="capitalize w-fit">
                          {registration.status}
                        </Badge>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">
                          Submitted at
                        </span>
                        <p className="font-medium">
                          {registration.submittedAt
                            ? formatDate(registration.submittedAt)
                            : "—"}
                        </p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">
                          Completed at
                        </span>
                        <p className="font-medium">
                          {registration.completedAt
                            ? formatDate(registration.completedAt)
                            : "—"}
                        </p>
                      </div>
                    </div>
                    {registration.subscriptionStatus && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-2">
                        <div className="grid gap-1">
                          <span className="text-muted-foreground">
                            Subscription status
                          </span>
                          <Badge
                            variant="outline"
                            className="capitalize w-fit"
                          >
                            {registration.subscriptionStatus.status}
                          </Badge>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-muted-foreground">
                            Trial ends
                          </span>
                          <p className="font-medium">
                            {registration.subscriptionStatus.trialEndDate
                              ? formatDate(
                                  registration.subscriptionStatus.trialEndDate,
                                )
                              : "—"}
                          </p>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-muted-foreground">
                            Subscription ends
                          </span>
                          <p className="font-medium">
                            {registration.subscriptionStatus.subscriptionEndDate
                              ? formatDate(
                                  registration.subscriptionStatus
                                    .subscriptionEndDate,
                                )
                              : "—"}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {locations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Locations</CardTitle>
                      <CardDescription>
                        Locations submitted during registration.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {locations.map((loc, index) => (
                        <div
                          key={`${loc.locationName}-${index}`}
                          className="rounded-md border border-border p-3 space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {loc.locationName}
                              </span>
                              {loc.isHeadquarters && (
                                <Badge variant="secondary" className="text-xs">
                                  Headquarters
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {loc.city}, {loc.state}
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            {loc.address}, {loc.country}, {loc.zipCode}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {[loc.phone, loc.email]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Stats</CardTitle>
                    <CardDescription>
                      High-level overview for this gym.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">
                        Total members
                      </span>
                      <p className="font-medium">{stats.totalMembers}</p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">
                        Total trainers
                      </span>
                      <p className="font-medium">{stats.totalTrainers}</p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">
                        Total locations
                      </span>
                      <p className="font-medium">{stats.totalLocations}</p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">
                        Active memberships
                      </span>
                      <p className="font-medium">{stats.activeMemberships}</p>
                    </div>
                  </CardContent>
                </Card>

                <ConfirmDialog
                  open={isReasonDialogOpen && decision !== null}
                  onOpenChange={(open) => {
                    setIsReasonDialogOpen(open);
                    if (!open) {
                      setDecision(null);
                      setReason("");
                    }
                  }}
                  title={
                    decision === "approved"
                      ? "Approve application"
                      : "Reject application"
                  }
                  description={
                    decision === "rejected"
                      ? "Please provide a reason for rejecting this application. This may be shared with the gym owner."
                      : "Optionally provide a reason for approving this application."
                  }
                  confirmLabel={
                    decision === "approved" ? "Approve" : "Reject application"
                  }
                  confirmVariant={decision === "approved" ? "default" : "destructive"}
                  isLoading={finalizing !== null}
                  onConfirm={async () => {
                    if (!decision) return;
                    const trimmed = reason.trim();
                    if (decision === "rejected" && !trimmed) {
                      showError(
                        "Error",
                        "Please enter a reason for rejecting this application.",
                      );
                      return;
                    }
                    await handleFinalize(decision, trimmed || undefined);
                    setIsReasonDialogOpen(false);
                    setDecision(null);
                    setReason("");
                  }}
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Reason
                      {decision === "rejected" && (
                        <span className="text-destructive"> *</span>
                      )}
                    </label>
                    <Textarea
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      placeholder={
                        decision === "rejected"
                          ? "Explain why this application is being rejected..."
                          : "Optionally add more context for this decision..."
                      }
                      rows={4}
                    />
                  </div>
                </ConfirmDialog>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

