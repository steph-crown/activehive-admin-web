import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useActivateTrainerMutation,
  useDeactivateTrainerMutation,
  useDeleteTrainerMutation,
} from "../services";
import type { Trainer } from "../types";

type TrainerActionType = "delete" | "activate" | "deactivate";

type ConfirmTrainerActionDialogProps = {
  trainer: Trainer | null;
  action: TrainerActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmTrainerActionDialog({
  trainer,
  action,
  open,
  onOpenChange,
}: ConfirmTrainerActionDialogProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: deleteTrainer, isPending: deleting } =
    useDeleteTrainerMutation();
  const { mutateAsync: deactivateTrainer, isPending: deactivating } =
    useDeactivateTrainerMutation();
  const { mutateAsync: activateTrainer, isPending: activating } =
    useActivateTrainerMutation();

  const isPending = deleting || deactivating || activating;

  if (!trainer) return null;

  const titles: Record<TrainerActionType, string> = {
    delete: "Delete Trainer",
    deactivate: "Deactivate Trainer",
    activate: "Activate Trainer",
  };

  const descriptions: Record<TrainerActionType, string> = {
    delete:
      "Permanently delete this trainer? This action cannot be undone and the user will lose access.",
    deactivate:
      "Deactivate this trainer? They will no longer be able to sign in until reactivated.",
    activate: "Activate this trainer? They will regain access to the platform.",
  };

  const confirmLabel: Record<TrainerActionType, string> = {
    delete: "Delete",
    deactivate: "Deactivate",
    activate: "Activate",
  };

  const handleConfirm = async () => {
    try {
      if (action === "delete") {
        await deleteTrainer(trainer.id);
      } else if (action === "deactivate") {
        await deactivateTrainer(trainer.id);
      } else {
        await activateTrainer(trainer.id);
      }
      showSuccess("Success", `${titles[action]} successful`);
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
      title={titles[action]}
      description={descriptions[action]}
      confirmLabel={confirmLabel[action]}
      confirmVariant={action === "delete" ? "destructive" : "default"}
      isLoading={isPending}
      onConfirm={handleConfirm}
    >
      <p className="font-medium">
        {trainer.firstName} {trainer.lastName}
      </p>
      <p className="text-muted-foreground text-xs">{trainer.email}</p>
    </ConfirmDialog>
  );
}
