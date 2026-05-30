import { canEditChallenge } from "../lib/challenge-form-utils";
import type { PlatformChallenge, UpdateChallengePayload } from "../types";
import { ChallengeFormDialog } from "./challenge-form-dialog";

type EditChallengeDialogProps = {
  readonly challenge: PlatformChallenge | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly isSubmitting?: boolean;
  readonly onSave: (payload: UpdateChallengePayload) => void;
};

export function EditChallengeDialog({
  challenge,
  open,
  onOpenChange,
  isSubmitting = false,
  onSave,
}: EditChallengeDialogProps) {
  return (
    <ChallengeFormDialog
      mode="edit"
      open={open}
      onOpenChange={onOpenChange}
      isSubmitting={isSubmitting}
      challenge={challenge}
      onSubmit={(values) => {
        if (!challenge || !canEditChallenge(challenge.startDate)) return;
        onSave({
          id: challenge.id,
          slug: challenge.slug,
          ...values,
          status: values.status!,
        });
      }}
    />
  );
}
