import { Link } from "react-router-dom";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useLocationByIdQuery } from "../services";
import type { LocationAddress, LocationDetail } from "../types";
import { ConfirmLocationStatusDialog } from "./confirm-location-status-dialog";

type LocationDetailsDialogProps = {
  locationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function LocationDetailsDialog({
  locationId,
  open,
  onOpenChange,
}: Readonly<LocationDetailsDialogProps>) {
  const [statusAction, setStatusAction] = useState<
    "activate" | "deactivate" | null
  >(null);
  const { data, isLoading, error } = useLocationByIdQuery(
    locationId ?? undefined,
    open && Boolean(locationId),
  );

  const location: LocationDetail | undefined = data;
  const gym = location?.gym;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-2xl">
        {!locationId ? null : isLoading ? (
          <>
            <DialogHeader>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </DialogHeader>
            <div className="grid gap-4 pt-2">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </>
        ) : error || !location ? (
          <>
            <DialogHeader>
              <DialogTitle>Location</DialogTitle>
              <DialogDescription className="text-destructive">
                Failed to load location.{" "}
                {error instanceof Error ? error.message : "Please try again."}
              </DialogDescription>
            </DialogHeader>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{location.locationName}</DialogTitle>
              <DialogDescription>Location details</DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {location.isActive ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusAction("deactivate")}
                >
                  Deactivate
                </Button>
              ) : (
                <Button size="sm" onClick={() => setStatusAction("activate")}>
                  Activate
                </Button>
              )}
            </div>

            <ConfirmLocationStatusDialog
              location={statusAction ? location : null}
              action={statusAction ?? "deactivate"}
              open={statusAction !== null}
              onOpenChange={(next) => {
                if (!next) setStatusAction(null);
              }}
            />

            <div className="grid gap-4">
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Details</CardTitle>
                  <CardDescription>Address and contact</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                  <div className="grid gap-1">
                    <span className="text-muted-foreground">Address</span>
                    <p className="font-medium">
                      {formatAddress(location.address)}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Phone</span>
                      <p className="font-medium">{location.phone ?? "—"}</p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Email</span>
                      <p className="font-medium">{location.email ?? "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
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

              {gym ? (
                <Card className="shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Gym</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-1">
                      <span>{gym.name}</span>
                      <Link
                        to={`/dashboard/gyms/${gym.id}`}
                        className="text-primary font-medium underline-offset-4 hover:underline"
                        onClick={() => onOpenChange(false)}
                      >
                        Open gym
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
                    {gym.owner ? (
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Owner</span>
                        <p className="font-medium">
                          {gym.owner.firstName} {gym.owner.lastName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {gym.owner.email} · {gym.owner.status}
                        </p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
