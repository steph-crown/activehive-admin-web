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
  useActivateGymOwnerMutation,
  useDeactivateGymOwnerMutation,
} from "../services";
import type { GymOwner } from "../types";

type GymOwnerActionType = "activate" | "deactivate";

type ConfirmGymOwnerStatusDialogProps = {
  owner: GymOwner | null;
  action: GymOwnerActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmGymOwnerStatusDialog({
  owner,
  action,
  open,
  onOpenChange,
}: ConfirmGymOwnerStatusDialogProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: deactivateOwner, isPending: deactivating } =
    useDeactivateGymOwnerMutation();
  const { mutateAsync: activateOwner, isPending: activating } =
    useActivateGymOwnerMutation();

  const isPending = deactivating || activating;

  if (!owner) return null;

  const isActivate = action === "activate";

  const title = isActivate ? "Activate Gym Owner" : "Deactivate Gym Owner";
  const description = isActivate
    ? "Activate this gym owner and all their gyms."
    : "Deactivate this gym owner and all their gyms. They will no longer be able to access the platform until reactivated.";

  const confirmLabel = isActivate ? "Activate" : "Deactivate";

  const handleConfirm = async () => {
    try {
      if (isActivate) {
        await activateOwner(owner.id);
      } else {
        await deactivateOwner(owner.id);
      }
      showSuccess("Success", `${confirmLabel}d gym owner successfully`);
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
          <p className="font-medium">
            {owner.firstName} {owner.lastName}
          </p>
          <p className="text-muted-foreground text-xs">{owner.email}</p>
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
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
