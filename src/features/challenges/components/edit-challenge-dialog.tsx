import { canEditChallenge } from "../lib/challenge-form-utils";
import type { PlatformChallenge, UpdateChallengePayload } from "../types";
import { ChallengeFormDialog } from "./challenge-form-dialog";

type EditChallengeDialogProps = {
  readonly challenge: PlatformChallenge | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (payload: UpdateChallengePayload) => void;
};

export function EditChallengeDialog({
  challenge,
  open,
  onOpenChange,
  onSave,
}: EditChallengeDialogProps) {
  return (
    <ChallengeFormDialog
      mode="edit"
      open={open}
      onOpenChange={onOpenChange}
      challenge={challenge}
      onSubmit={(values) => {
        if (!challenge || !canEditChallenge(challenge.startsAt)) return;
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
