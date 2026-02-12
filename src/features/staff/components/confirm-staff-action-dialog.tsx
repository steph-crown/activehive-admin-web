import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useActivateStaffMutation,
  useDeactivateStaffMutation,
  useDeleteStaffMutation,
} from "../services";
import type { Staff } from "../types";

type StaffActionType = "delete" | "activate" | "deactivate";

type ConfirmStaffActionDialogProps = {
  staff: Staff | null;
  action: StaffActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmStaffActionDialog({
  staff,
  action,
  open,
  onOpenChange,
}: ConfirmStaffActionDialogProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: deleteStaff, isPending: deleting } =
    useDeleteStaffMutation();
  const { mutateAsync: deactivateStaff, isPending: deactivating } =
    useDeactivateStaffMutation();
  const { mutateAsync: activateStaff, isPending: activating } =
    useActivateStaffMutation();

  const isPending = deleting || deactivating || activating;

  if (!staff) return null;

  const titles: Record<StaffActionType, string> = {
    delete: "Delete Staff",
    deactivate: "Deactivate Staff",
    activate: "Activate Staff",
  };

  const descriptions: Record<StaffActionType, string> = {
    delete:
      "Permanently delete this staff member? This action cannot be undone and the user will lose access.",
    deactivate:
      "Deactivate this staff member? They will no longer be able to sign in until reactivated.",
    activate:
      "Activate this staff member? They will regain access to the platform.",
  };

  const confirmLabel: Record<StaffActionType, string> = {
    delete: "Delete",
    deactivate: "Deactivate",
    activate: "Activate",
  };

  const handleConfirm = async () => {
    try {
      if (action === "delete") {
        await deleteStaff(staff.id);
      } else if (action === "deactivate") {
        await deactivateStaff(staff.id);
      } else {
        await activateStaff(staff.id);
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
        {staff.firstName} {staff.lastName}
      </p>
      <p className="text-muted-foreground text-xs">{staff.email}</p>
    </ConfirmDialog>
  );
}
