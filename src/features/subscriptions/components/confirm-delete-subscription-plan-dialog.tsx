import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDeleteSubscriptionPlanMutation } from "../services";
import type { SubscriptionPlan } from "../types";

type ConfirmDeleteSubscriptionPlanDialogProps = {
  readonly plan: SubscriptionPlan | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
};

export function ConfirmDeleteSubscriptionPlanDialog({
  plan,
  open,
  onOpenChange,
}: ConfirmDeleteSubscriptionPlanDialogProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: deletePlan, isPending } =
    useDeleteSubscriptionPlanMutation();

  if (!plan) return null;

  const handleConfirm = async () => {
    try {
      await deletePlan({
        id: plan.id,
        planType: plan.planType,
      });
      showSuccess("Success", "Subscription plan deleted successfully");
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete subscription plan. Please try again.";
      showError("Error", message);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Subscription Plan"
      description="This will permanently delete this platform plan. You cannot delete plans that have active subscriptions."
      confirmLabel="Delete"
      confirmVariant="destructive"
      isLoading={isPending}
      onConfirm={handleConfirm}
    >
      <p className="font-medium">{plan.name}</p>
      <p className="text-muted-foreground text-xs capitalize">
        {plan.planType.replace("_", " ")}
      </p>
    </ConfirmDialog>
  );
}

