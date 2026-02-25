import { Link } from "react-router-dom";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import { formatDate } from "@/lib/utils";
import type { Gym } from "../types";

type GymsTableCallbacks = {
  onActivateGym?: (gym: Gym) => void;
  onDeactivateGym?: (gym: Gym) => void;
};

function makeGymsColumns({
  onActivateGym,
  onDeactivateGym,
}: GymsTableCallbacks): ColumnDef<Gym>[] {
  return [
  {
    accessorKey: "name",
    header: "Gym Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.original.owner;
      if (!owner) return <span className="text-muted-foreground">N/A</span>;
      return (
        <div>
          {owner.firstName} {owner.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Location",
    cell: ({ row }) => {
      const address = row.original.address;
      if (!address) return <span className="text-muted-foreground">N/A</span>;
      return (
        <div className="text-sm">
          {address.city}, {address.state}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.email || (
          <span className="text-muted-foreground">N/A</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "approvalStatus",
    header: "Approval Status",
    cell: ({ row }) => {
      const status = row.original.approvalStatus;
      if (!status) {
        return <span className="text-muted-foreground text-sm">N/A</span>;
      }

      let variant: "outline" | "secondary" | "destructive" = "outline";
      if (status === "approved") {
        variant = "secondary";
      } else if (status === "rejected") {
        variant = "destructive";
      }

      return (
        <Badge variant={variant} className="capitalize text-xs px-2 py-0.5">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.isActive ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "trainers",
    header: "Trainers",
    cell: ({ row }) => {
      const trainers = row.original.trainers;
      return (
        <div className="text-sm">
          {trainers.length > 0 ? (
            <span>
              {trainers.length} trainer{trainers.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-muted-foreground">No trainers</span>
          )}
        </div>
      );
    },
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
    cell: ({ row }) => {
      const gym = row.original;
      const isActive = gym.isActive;

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
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/gyms/${gym.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/gyms/${gym.id}/application`}>
                Review application
              </Link>
            </DropdownMenuItem>
            {isActive && onDeactivateGym && (
              <DropdownMenuItem onClick={() => onDeactivateGym(gym)}>
                Deactivate
              </DropdownMenuItem>
            )}
            {!isActive && onActivateGym && (
              <DropdownMenuItem onClick={() => onActivateGym(gym)}>
                Activate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
}

type GymsTableProps = {
  data: Gym[];
  onActivateGym?: (gym: Gym) => void;
  onDeactivateGym?: (gym: Gym) => void;
};

export function GymsTable({
  data,
  onActivateGym,
  onDeactivateGym,
}: GymsTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeGymsColumns({ onActivateGym, onDeactivateGym })}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
