import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Member } from "../types";

type ViewMemberDialogProps = {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ViewMemberDialog({
  member,
  open,
  onOpenChange,
}: ViewMemberDialogProps) {
  if (!member) return null;

  const memberships = Array.isArray(member.memberships) ? member.memberships : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
          <DialogDescription>
            Account and membership information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid gap-1">
            <span className="text-muted-foreground">Name</span>
            <p className="font-medium">
              {member.firstName} {member.lastName}
            </p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium">{member.email}</p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Phone</span>
            <p className="font-medium">{member.phoneNumber ?? "—"}</p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className="w-fit">
              {member.status}
            </Badge>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Email verified</span>
            <p className="font-medium">
              {member.isEmailVerified ? "Verified" : "Not verified"}
            </p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Memberships</span>
            <p className="font-medium">
              {memberships.length > 0
                ? `${memberships.length} membership${memberships.length !== 1 ? "s" : ""}`
                : "No memberships"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <span className="text-muted-foreground">Created</span>
              <p className="font-medium">{formatDate(member.createdAt)}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Updated</span>
              <p className="font-medium">{formatDate(member.updatedAt)}</p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
