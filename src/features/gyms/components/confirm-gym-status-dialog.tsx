import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { useActivateGymMutation, useDeactivateGymMutation } from "../services";
import type { Gym } from "../types";

type GymActionType = "activate" | "deactivate";

type ConfirmGymStatusDialogProps = {
  gym: Gym | null;
  action: GymActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmGymStatusDialog({
  gym,
  action,
  open,
  onOpenChange,
}: Readonly<ConfirmGymStatusDialogProps>) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: deactivateGym, isPending: deactivating } =
    useDeactivateGymMutation();
  const { mutateAsync: activateGym, isPending: activating } =
    useActivateGymMutation();

  const isPending = deactivating || activating;

  if (!gym) return null;

  const isActivate = action === "activate";

  const title = isActivate ? "Activate Gym" : "Deactivate Gym";
  const description = isActivate
    ? "Activate this gym and all its locations. Cannot activate if the gym owner is inactive."
    : "Deactivate this gym and all its locations.";

  const confirmLabel = isActivate ? "Activate" : "Deactivate";

  const handleConfirm = async () => {
    try {
      if (isActivate) {
        await activateGym(gym.id);
      } else {
        await deactivateGym(gym.id);
      }
      showSuccess("Success", `${confirmLabel}d gym successfully`);
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
      <p className="font-medium">{gym.name}</p>
      {gym.email && (
        <p className="text-muted-foreground text-xs">{gym.email}</p>
      )}
    </ConfirmDialog>
  );
}
