/* eslint-disable react-refresh/only-export-components */
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
import type { Trainer } from "../types";

type TrainersColumnCallbacks = {
  onViewTrainer?: (trainer: Trainer) => void;
  onEditTrainer?: (trainer: Trainer) => void;
  onDeleteTrainer?: (trainer: Trainer) => void;
  onActivateTrainer?: (trainer: Trainer) => void;
  onDeactivateTrainer?: (trainer: Trainer) => void;
};

function makeTrainersColumns(
  callbacks: TrainersColumnCallbacks,
): ColumnDef<Trainer>[] {
  const {
    onViewTrainer,
    onEditTrainer,
    onDeleteTrainer,
    onActivateTrainer,
    onDeactivateTrainer,
  } = callbacks;

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
        const trainer = row.original;
        return (
          <div>
            {trainer.firstName} {trainer.lastName}
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.phoneNumber || (
            <span className="text-muted-foreground">N/A</span>
          )}
        </div>
      ),
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
        return (
          <div className="text-sm">{formatDate(row.original.createdAt)}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const trainer = row.original;
        const isActive = trainer.status === "active";
        const isPending = trainer.status === "pending";
        const hasStatusActions =
          !isPending &&
          ((isActive && onDeactivateTrainer) ||
            (!isActive && onActivateTrainer));
        const hasDelete = Boolean(onDeleteTrainer);

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
            <DropdownMenuContent align="end" className="w-40">
              {onViewTrainer && (
                <DropdownMenuItem onClick={() => onViewTrainer(trainer)}>
                  View Details
                </DropdownMenuItem>
              )}
              {onEditTrainer && (
                <DropdownMenuItem onClick={() => onEditTrainer(trainer)}>
                  Edit
                </DropdownMenuItem>
              )}
              {(hasStatusActions || hasDelete) && <DropdownMenuSeparator />}
              {hasStatusActions && isActive && onDeactivateTrainer && (
                <DropdownMenuItem onClick={() => onDeactivateTrainer(trainer)}>
                  Deactivate
                </DropdownMenuItem>
              )}
              {hasStatusActions && !isActive && onActivateTrainer && (
                <DropdownMenuItem onClick={() => onActivateTrainer(trainer)}>
                  Activate
                </DropdownMenuItem>
              )}
              {onDeleteTrainer && (
                <>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeleteTrainer(trainer)}
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

type TrainersTableProps = {
  data: Trainer[];
  onViewTrainer?: (trainer: Trainer) => void;
  onEditTrainer?: (trainer: Trainer) => void;
  onDeleteTrainer?: (trainer: Trainer) => void;
  onActivateTrainer?: (trainer: Trainer) => void;
  onDeactivateTrainer?: (trainer: Trainer) => void;
};

export function TrainersTable({
  data,
  onViewTrainer,
  onEditTrainer,
  onDeleteTrainer,
  onActivateTrainer,
  onDeactivateTrainer,
}: TrainersTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeTrainersColumns({
        onViewTrainer,
        onEditTrainer,
        onDeleteTrainer,
        onActivateTrainer,
        onDeactivateTrainer,
      })}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
