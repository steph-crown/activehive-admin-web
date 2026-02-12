import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useActivateAdminMutation,
  useDeactivateAdminMutation,
  useDeleteAdminMutation,
} from "../services";
import type { Admin } from "../types";

type AdminActionType = "delete" | "activate" | "deactivate";

type ConfirmAdminActionDialogProps = {
  admin: Admin | null;
  action: AdminActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmAdminActionDialog({
  admin,
  action,
  open,
  onOpenChange,
}: ConfirmAdminActionDialogProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: deleteAdmin, isPending: deleting } =
    useDeleteAdminMutation();
  const { mutateAsync: deactivateAdmin, isPending: deactivating } =
    useDeactivateAdminMutation();
  const { mutateAsync: activateAdmin, isPending: activating } =
    useActivateAdminMutation();

  const isPending = deleting || deactivating || activating;

  if (!admin) return null;

  const titles: Record<AdminActionType, string> = {
    delete: "Delete Admin",
    deactivate: "Deactivate Admin",
    activate: "Activate Admin",
  };

  const descriptions: Record<AdminActionType, string> = {
    delete:
      "Permanently delete this admin user? This action cannot be undone and the user will lose access.",
    deactivate:
      "Deactivate this admin user? They will no longer be able to sign in until reactivated.",
    activate:
      "Activate this admin user? They will regain access to the admin dashboard.",
  };

  const confirmLabel: Record<AdminActionType, string> = {
    delete: "Delete",
    deactivate: "Deactivate",
    activate: "Activate",
  };

  const handleConfirm = async () => {
    try {
      if (action === "delete") {
        await deleteAdmin(admin.id);
      } else if (action === "deactivate") {
        await deactivateAdmin(admin.id);
      } else {
        await activateAdmin(admin.id);
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
        {admin.firstName} {admin.lastName}
      </p>
      <p className="text-muted-foreground text-xs">{admin.email}</p>
    </ConfirmDialog>
  );
}
