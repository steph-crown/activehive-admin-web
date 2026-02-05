import { Link } from "react-router-dom";
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
import { useGymByIdQuery } from "../services";
import type { GymAddress, GymLocation } from "../types";

function formatAddress(address: GymAddress | null): string {
  if (!address) return "—";
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);
  return parts.join(", ") || "—";
}

type GymDetailPageProps = {
  gymId: string;
};

export function GymDetailPage({ gymId }: GymDetailPageProps) {
  const { data, isLoading, error } = useGymByIdQuery(gymId);

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
              Error loading gym. {error instanceof Error ? error.message : "Please try again."}
            </p>
            <Button variant="outline" asChild className="mt-4">
              <Link to="/dashboard/gyms">Back to Gyms</Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const { gym, locations, staffMembers, memberships, subscription } = data;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/gyms">← Back to Gyms</Link>
                  </Button>
                </div>

                {/* Gym info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {gym.logo && (
                        <img
                          src={gym.logo}
                          alt=""
                          className="size-16 rounded-lg object-cover border border-border"
                        />
                      )}
                      <div className="space-y-1">
                        <CardTitle className="text-2xl">{gym.name}</CardTitle>
                        <CardDescription>
                          Gym details and contact information
                        </CardDescription>
                        <Badge variant={gym.isActive ? "default" : "secondary"} className="w-fit">
                          {gym.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm">
                    {gym.description && (
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Description</span>
                        <p>{gym.description}</p>
                      </div>
                    )}
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Address</span>
                      <p className="font-medium">{formatAddress(gym.address)}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Phone</span>
                        <p className="font-medium">{gym.phoneNumber ?? "—"}</p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Email</span>
                        <p className="font-medium">{gym.email ?? "—"}</p>
                      </div>
                    </div>
                    {gym.website && (
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Website</span>
                        <a
                          href={gym.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {gym.website}
                        </a>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Created</span>
                        <p className="font-medium">{formatDate(gym.createdAt)}</p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Updated</span>
                        <p className="font-medium">{formatDate(gym.updatedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Owner */}
                {gym.owner && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Owner</CardTitle>
                      <CardDescription>Gym owner information</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 text-sm">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Name</span>
                        <p className="font-medium">
                          {gym.owner.firstName} {gym.owner.lastName}
                        </p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Email</span>
                        <p className="font-medium">{gym.owner.email}</p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="w-fit">
                          {gym.owner.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Locations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Locations</CardTitle>
                    <CardDescription>
                      {locations.length > 0
                        ? `${locations.length} location${locations.length !== 1 ? "s" : ""}`
                        : "No locations"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {locations.length > 0 ? (
                      <ul className="space-y-4">
                        {locations.map((loc: GymLocation) => (
                          <li
                            key={loc.id}
                            className="rounded-lg border border-border p-4 space-y-2 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{loc.locationName}</span>
                              {loc.isHeadquarters && (
                                <Badge variant="secondary" className="text-xs">
                                  Headquarters
                                </Badge>
                              )}
                              <Badge variant={loc.isActive ? "default" : "secondary"} className="text-xs">
                                {loc.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            {loc.address && (
                              <p className="text-muted-foreground">
                                {formatAddress(loc.address)}
                              </p>
                            )}
                            {(loc.phone || loc.email) && (
                              <p className="text-muted-foreground">
                                {[loc.phone, loc.email].filter(Boolean).join(" · ")}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No locations added yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Staff & Memberships row */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Staff</CardTitle>
                      <CardDescription>Staff members at this gym</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium">
                        {staffMembers.length > 0
                          ? `${staffMembers.length} member${staffMembers.length !== 1 ? "s" : ""}`
                          : "No staff members"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Memberships</CardTitle>
                      <CardDescription>Membership plans</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium">
                        {memberships.length > 0
                          ? `${memberships.length} plan${memberships.length !== 1 ? "s" : ""}`
                          : "No memberships"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Subscription */}
                {subscription && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription</CardTitle>
                      <CardDescription>Platform subscription for this gym</CardDescription>
                      <Badge variant={subscription.isTrial ? "secondary" : "default"} className="w-fit">
                        {subscription.status}
                        {subscription.isTrial ? " (Trial)" : ""}
                      </Badge>
                    </CardHeader>
                    <CardContent className="grid gap-4 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subscription.monthlyPrice && (
                          <div className="grid gap-1">
                            <span className="text-muted-foreground">Monthly price</span>
                            <p className="font-medium">{subscription.monthlyPrice}</p>
                          </div>
                        )}
                        <div className="grid gap-1">
                          <span className="text-muted-foreground">Auto-renew</span>
                          <p className="font-medium">{subscription.autoRenew ? "Yes" : "No"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                        {subscription.trialEndDate && (
                          <div className="grid gap-1">
                            <span className="text-muted-foreground">Trial ends</span>
                            <p className="font-medium">{formatDate(subscription.trialEndDate)}</p>
                          </div>
                        )}
                        {subscription.nextPaymentDate && (
                          <div className="grid gap-1">
                            <span className="text-muted-foreground">Next payment</span>
                            <p className="font-medium">{formatDate(subscription.nextPaymentDate)}</p>
                          </div>
                        )}
                        {subscription.subscriptionEndDate && (
                          <div className="grid gap-1">
                            <span className="text-muted-foreground">Subscription ends</span>
                            <p className="font-medium">{formatDate(subscription.subscriptionEndDate)}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
