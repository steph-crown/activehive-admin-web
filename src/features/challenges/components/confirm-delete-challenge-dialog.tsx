import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { PlatformChallenge } from "../types";

type ConfirmDeleteChallengeDialogProps = {
  readonly challenge: PlatformChallenge | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: () => void;
};

export function ConfirmDeleteChallengeDialog({
  challenge,
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteChallengeDialogProps) {
  if (!challenge) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete challenge"
      description="This removes the challenge from the admin list. Participants will no longer see it if it was published."
      confirmLabel="Delete"
      confirmVariant="destructive"
      onConfirm={onConfirm}
    >
      <p className="font-medium">{challenge.name}</p>
      <p className="text-muted-foreground text-xs">{challenge.slug}</p>
    </ConfirmDialog>
  );
}
