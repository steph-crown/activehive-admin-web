import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { gymsApi, useGymRegistrationStatusQuery } from "../services";

type FinalizeMode = "approve" | "reject";

export type GymApplicationFinalizeDialogProps = {
  gymId: string | null;
  gymName: string;
  mode: FinalizeMode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinalized?: () => void;
};

export function GymApplicationFinalizeDialog({
  gymId,
  gymName,
  mode,
  open,
  onOpenChange,
  onFinalized,
}: GymApplicationFinalizeDialogProps) {
  const { showSuccess, showError } = useToast();
  const [reason, setReason] = useState("");
  const [finalizing, setFinalizing] = useState(false);

  const { data, isLoading, error, refetch } = useGymRegistrationStatusQuery(
    gymId ?? undefined,
    Boolean(open && gymId),
  );

  const resetAndClose = () => {
    setReason("");
    onOpenChange(false);
  };

  const handleFinalize = async (status: FinalizeMode) => {
    if (!data) return;
    const approvalId = (
      data.registration.stepData?.["6"] as { approvalId?: string } | undefined
    )?.approvalId;
    if (!approvalId) {
      showError("Error", "Missing approval ID for this application.");
      return;
    }

    const trimmed = reason.trim();
    if (status === "reject" && !trimmed) {
      showError(
        "Error",
        "Please enter a reason for rejecting this application.",
      );
      return;
    }

    try {
      setFinalizing(true);
      await gymsApi.finalizeGymApplication(approvalId, {
        status: status === "approve" ? "approved" : "rejected",
        reason: trimmed || undefined,
      });
      showSuccess(
        "Success",
        `Application ${status === "approve" ? "approved" : "rejected"} successfully`,
      );
      await refetch();
      onFinalized?.();
      resetAndClose();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to finalize application.";
      showError("Error", message);
    } finally {
      setFinalizing(false);
    }
  };

  const canFinalize =
    data &&
    data.registration.status === "pending_approval" &&
    (data.gym.approvalStatus === "pending" || data.gym.approvalStatus == null);

  return (
    <ConfirmDialog
      open={open && mode !== null}
      onOpenChange={(next) => {
        if (!next) {
          setReason("");
        }
        onOpenChange(next);
      }}
      title={
        mode === "approve"
          ? `Approve application — ${gymName}`
          : `Reject application — ${gymName}`
      }
      description={
        mode === "reject"
          ? "Please provide a reason for rejecting this application. This may be shared with the gym owner."
          : "Optionally provide a note with this approval."
      }
      confirmLabel={mode === "approve" ? "Approve" : "Reject application"}
      confirmVariant={mode === "approve" ? "default" : "destructive"}
      isLoading={finalizing}
      onConfirm={async () => {
        if (!mode) return;
        if (isLoading) return;
        if (error || !data) {
          showError(
            "Error",
            "Could not load application data. Open gym details to review.",
          );
          return;
        }
        if (!canFinalize) {
          showError(
            "Error",
            "This application is no longer pending approval.",
          );
          return;
        }
        await handleFinalize(mode);
      }}
    >
      <div className="space-y-3">
        {isLoading && (
          <p className="text-muted-foreground text-sm">Loading application…</p>
        )}
        {error && !isLoading && (
          <p className="text-destructive text-sm">
            Failed to load registration status for this gym.
          </p>
        )}
        {data && !canFinalize && !isLoading && (
          <p className="text-muted-foreground text-sm">
            This gym is not awaiting approval.
          </p>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Reason
            {mode === "reject" && (
              <span className="text-destructive"> *</span>
            )}
          </label>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={
              mode === "reject"
                ? "Explain why this application is being rejected…"
                : "Optional note for this approval…"
            }
            rows={4}
          />
        </div>
      </div>
    </ConfirmDialog>
  );
}
