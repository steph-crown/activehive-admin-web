import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { OwnedGym } from "@/features/users/types";
import type { GymOwner } from "../types";

function formatAddress(address: OwnedGym["address"]): string {
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

type ViewGymOwnerDialogProps = {
  owner: GymOwner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ViewGymOwnerDialog({
  owner,
  open,
  onOpenChange,
}: ViewGymOwnerDialogProps) {
  if (!owner) return null;

  const gyms = owner.ownedGyms ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Gym Owner Details</DialogTitle>
          <DialogDescription>
            Account and gym information for this owner.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid gap-1">
            <span className="text-muted-foreground">Name</span>
            <p className="font-medium">
              {owner.firstName} {owner.lastName}
            </p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium">{owner.email}</p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Phone</span>
            <p className="font-medium">{owner.phoneNumber ?? "—"}</p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className="w-fit">
              {owner.status}
            </Badge>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Email verified</span>
            <p className="font-medium">
              {owner.isEmailVerified ? "Verified" : "Not verified"}
            </p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Onboarding</span>
            <p className="font-medium">
              {owner.onboardingCompleted ? "Completed" : "Pending"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <span className="text-muted-foreground">Created</span>
              <p className="font-medium">{formatDate(owner.createdAt)}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Updated</span>
              <p className="font-medium">{formatDate(owner.updatedAt)}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <span className="text-muted-foreground">Owned gyms</span>
            {gyms.length > 0 ? (
              <ul className="space-y-3 rounded-md border border-border p-3">
                {gyms.map((gym) => (
                  <li key={gym.id} className="space-y-1.5">
                    <Link
                      to={`/dashboard/gyms/${gym.id}`}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {gym.name}
                    </Link>
                    <div className="pl-0 text-muted-foreground">
                      {gym.address && (
                        <p>{formatAddress(gym.address)}</p>
                      )}
                      {(gym.phoneNumber || gym.email) && (
                        <p>
                          {[gym.phoneNumber, gym.email].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No gyms</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
