import { BlockLoader } from "@/components/loader/block-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocationByIdQuery } from "../services";
import type { LocationAddress, LocationDetail } from "../types";
import { ConfirmLocationStatusDialog } from "./confirm-location-status-dialog";

type LocationDetailPageProps = {
  locationId: string;
};

function formatAddress(address: LocationAddress | null): string {
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

export function LocationDetailPage({
  locationId,
}: Readonly<LocationDetailPageProps>) {
  const [statusAction, setStatusAction] = useState<
    "activate" | "deactivate" | null
  >(null);
  const { data, isLoading, error } = useLocationByIdQuery(locationId);

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
              Failed to load location.{" "}
              {error instanceof Error ? error.message : "Please try again."}
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const location: LocationDetail = data;
  const gym = location.gym;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/locations">← Back to Locations</Link>
                  </Button>
                  <div className="flex items-center gap-2">
                    {location.isActive ? (
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
                    )}
                  </div>
                </div>

                <ConfirmLocationStatusDialog
                  location={statusAction ? location : null}
                  action={statusAction ?? "deactivate"}
                  open={statusAction !== null}
                  onOpenChange={(open) => {
                    if (!open) {
                      setStatusAction(null);
                    }
                  }}
                />

                <Card>
                  <CardHeader>
                    <CardTitle>{location.locationName}</CardTitle>
                    <CardDescription>Location details</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm">
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Address</span>
                      <p className="font-medium">
                        {formatAddress(location.address)}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Phone</span>
                        <p className="font-medium">{location.phone ?? "—"}</p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Email</span>
                        <p className="font-medium">{location.email ?? "—"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Type</span>
                        <Badge variant="outline" className="w-fit">
                          {location.isHeadquarters ? "Headquarters" : "Branch"}
                        </Badge>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="w-fit">
                          {location.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Created</span>
                        <p className="font-medium">
                          {formatDate(location.createdAt)}
                        </p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Updated</span>
                        <p className="font-medium">
                          {formatDate(location.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {gym && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Gym</CardTitle>
                      <CardDescription className="flex gap-1 items-center">
                        {gym.name}

                        <Link
                          to={`/dashboard/gyms/${gym.id}`}
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          View
                        </Link>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 text-sm">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="w-fit">
                          {gym.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {gym.owner && (
                        <div className="grid gap-1">
                          <span className="text-muted-foreground">Owner</span>
                          <p className="font-medium">
                            {gym.owner.firstName} {gym.owner.lastName}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {gym.owner.email} · {gym.owner.status}
                          </p>
                        </div>
                      )}
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
