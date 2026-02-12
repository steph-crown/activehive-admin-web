import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useActivateLocationMutation,
  useDeactivateLocationMutation,
} from "../services";
import type { Location } from "../types";

type LocationActionType = "activate" | "deactivate";

type ConfirmLocationStatusDialogProps = {
  location: Location | null;
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="text-sm">
          <p className="font-medium">{location.locationName}</p>
          {location.email && (
            <p className="text-muted-foreground text-xs">{location.email}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
