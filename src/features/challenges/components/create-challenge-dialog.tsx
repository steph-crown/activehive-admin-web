import { generateChallengeSlug } from "../lib/challenge-form-utils";
import type { CreateChallengePayload } from "../types";
import { ChallengeFormDialog } from "./challenge-form-dialog";

type CreateChallengeDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly isSubmitting?: boolean;
  readonly onCreate: (payload: CreateChallengePayload) => void;
};

export function CreateChallengeDialog({
  open,
  onOpenChange,
  isSubmitting = false,
  onCreate,
}: CreateChallengeDialogProps) {
  return (
    <ChallengeFormDialog
      mode="create"
      open={open}
      onOpenChange={onOpenChange}
      isSubmitting={isSubmitting}
      onSubmit={(values) =>
        onCreate({
          ...values,
          slug: generateChallengeSlug(values.name),
        })
      }
    />
  );
}
