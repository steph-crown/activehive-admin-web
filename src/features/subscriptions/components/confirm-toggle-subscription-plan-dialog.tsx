import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import {
  useActivateSubscriptionPlanMutation,
  useDeactivateSubscriptionPlanMutation,
} from "../services";
import type { SubscriptionPlan } from "../types";

type ConfirmToggleSubscriptionPlanDialogProps = {
  readonly plan: SubscriptionPlan | null;
  readonly action: "activate" | "deactivate";
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
};

export function ConfirmToggleSubscriptionPlanDialog({
  plan,
  action,
  open,
  onOpenChange,
}: ConfirmToggleSubscriptionPlanDialogProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: activatePlan, isPending: isActivating } =
    useActivateSubscriptionPlanMutation();
  const { mutateAsync: deactivatePlan, isPending: isDeactivating } =
    useDeactivateSubscriptionPlanMutation();

  const isPending = isActivating || isDeactivating;

  if (!plan) return null;

  const isActivate = action === "activate";

  const handleConfirm = async () => {
    try {
      if (isActivate) {
        await activatePlan({ id: plan.id, planType: plan.planType });
        showSuccess("Success", "Plan activated — it is now visible to new subscribers.");
      } else {
        await deactivatePlan({ id: plan.id, planType: plan.planType });
        showSuccess("Success", "Plan deactivated — hidden from new signups. Existing subscribers are unaffected.");
      }
      onOpenChange(false);
    } catch (error) {
      showError("Error", getApiErrorMessage(error, `Failed to ${action} plan. Please try again.`));
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isActivate ? "Activate Plan" : "Deactivate Plan"}
      description={
        isActivate
          ? "This plan will become visible to new gym owners and trainers when they sign up."
          : "This plan will be hidden from new signups. Anyone already subscribed to this plan will not be affected."
      }
      confirmLabel={isActivate ? "Activate" : "Deactivate"}
      confirmVariant={isActivate ? "default" : "destructive"}
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
