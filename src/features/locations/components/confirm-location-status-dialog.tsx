import { Link } from "react-router-dom";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useActivateLocationMutation,
  useDeactivateLocationMutation,
} from "../services";
import type { Location, LocationDetail } from "../types";

type LocationActionType = "activate" | "deactivate";

type ConfirmLocationStatusDialogProps = {
  location: Location | LocationDetail | null;
  action: LocationActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmLocationStatusDialog({
  location,
  action,
  open,
  onOpenChange,
}: ConfirmLocationStatusDialogProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: deactivateLocation, isPending: deactivating } =
    useDeactivateLocationMutation();
  const { mutateAsync: activateLocation, isPending: activating } =
    useActivateLocationMutation();

  const isPending = deactivating || activating;

  if (!location) return null;

  const isActivate = action === "activate";

  const title = isActivate ? "Activate Location" : "Deactivate Location";
  const description = isActivate
    ? "Activate this location. Cannot activate if its gym is deactivated."
    : "Deactivate this location.";

  const confirmLabel = isActivate ? "Activate" : "Deactivate";

  const handleConfirm = async () => {
    try {
      if (isActivate) {
        await activateLocation(location.id);
      } else {
        await deactivateLocation(location.id);
      }
      showSuccess("Success", `${confirmLabel}d location successfully`);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Action failed. Please try again.";
      showError("Error", message);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      isLoading={isPending}
      onConfirm={handleConfirm}
    >
      <p className="font-medium">{location.locationName}</p>
      {location.email && (
        <p className="text-muted-foreground text-xs">{location.email}</p>
      )}
      {location.gym && (
        <p className="mt-2 text-xs">
          <span className="text-muted-foreground">Gym: </span>
          <Link
            to={`/dashboard/gyms/${location.gym.id}`}
            className="font-medium text-primary hover:underline"
          >
            {location.gym.name}
          </Link>
        </p>
      )}
    </ConfirmDialog>
  );
}
