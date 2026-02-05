import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Trainer, TrainerGym } from "../types";

function formatAddress(address: TrainerGym["address"]): string {
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

type ViewTrainerDialogProps = {
  trainer: Trainer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ViewTrainerDialog({
  trainer,
  open,
  onOpenChange,
}: ViewTrainerDialogProps) {
  if (!trainer) return null;

  const gym = trainer.gym as TrainerGym | null | undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Trainer Details</DialogTitle>
          <DialogDescription>
            Account and assigned gym information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid gap-1">
            <span className="text-muted-foreground">Name</span>
            <p className="font-medium">
              {trainer.firstName} {trainer.lastName}
            </p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium">{trainer.email}</p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Phone</span>
            <p className="font-medium">{trainer.phoneNumber ?? "—"}</p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className="w-fit">
              {trainer.status}
            </Badge>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Email verified</span>
            <p className="font-medium">
              {trainer.isEmailVerified ? "Verified" : "Not verified"}
            </p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Onboarding</span>
            <p className="font-medium">
              {trainer.onboardingCompleted ? "Completed" : "Pending"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <span className="text-muted-foreground">Created</span>
              <p className="font-medium">{formatDate(trainer.createdAt)}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Updated</span>
              <p className="font-medium">{formatDate(trainer.updatedAt)}</p>
            </div>
          </div>

          <div className="grid gap-2 pt-2 border-t">
            <span className="text-muted-foreground">Gym</span>
            {gym ? (
              <div className="rounded-md border border-border p-3 space-y-2">
                <Button variant="link" className="h-auto p-0 font-medium" asChild>
                  <Link to={`/dashboard/gyms/${gym.id}`}>
                    View gym — {gym.name}
                  </Link>
                </Button>
                {gym.address && (
                  <p className="text-muted-foreground text-xs">
                    {formatAddress(gym.address)}
                  </p>
                )}
                {(gym.phoneNumber || gym.email) && (
                  <p className="text-muted-foreground text-xs">
                    {[gym.phoneNumber, gym.email].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No gym assigned</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
