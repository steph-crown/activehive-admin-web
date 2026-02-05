import { type ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useApproveStepMutation } from "../services";
import type { GymOwner } from "../types";

function GymOwnerActions({
  owner,
  onViewOwner,
}: {
  owner: GymOwner;
  onViewOwner?: (owner: GymOwner) => void;
}) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: approveStep, isPending } = useApproveStepMutation();

  const handleApprove = async () => {
    try {
      await approveStep({
        userId: owner.id,
        payload: {
          step: "documents",
          status: "approved",
          comments: "Approved by admin",
        },
      });
      showSuccess("Success", "Gym owner approved successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to approve gym owner. Please try again.";
      showError("Error", message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={() => onViewOwner?.(owner)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        {owner.status === "pending" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleApprove} disabled={isPending}>
              {isPending ? "Approving..." : "Approve"}
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function makeGymOwnersColumns(onViewOwner: (owner: GymOwner) => void): ColumnDef<GymOwner>[] {
  return [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const owner = row.original;
      return (
        <div>
          {owner.firstName} {owner.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "active" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "ownedGyms",
    header: "Gyms",
    cell: ({ row }) => {
      const gyms = row.original.ownedGyms;
      return (
        <div className="text-sm">
          {gyms.length > 0 ? (
            <span>
              {gyms.length} gym{gyms.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-muted-foreground">No gyms</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "onboardingCompleted",
    header: "Onboarding",
    cell: ({ row }) => (
      <Badge variant={row.original.onboardingCompleted ? "default" : "secondary"}>
        {row.original.onboardingCompleted ? "Completed" : "Pending"}
      </Badge>
    ),
  },
  {
    accessorKey: "isEmailVerified",
    header: "Email Verified",
    cell: ({ row }) => (
      <Badge variant={row.original.isEmailVerified ? "default" : "secondary"}>
        {row.original.isEmailVerified ? "Verified" : "Not Verified"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return <div className="text-sm">{formatDate(row.original.createdAt)}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <GymOwnerActions owner={row.original} onViewOwner={onViewOwner} />
    ),
  },
];
}

type GymOwnersTableProps = {
  data: GymOwner[];
  onViewOwner?: (owner: GymOwner) => void;
};

export function GymOwnersTable({ data, onViewOwner }: GymOwnersTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeGymOwnersColumns(onViewOwner ?? (() => {}))}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
