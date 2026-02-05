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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import { formatDate } from "@/lib/utils";
import type { Gym } from "../types";

export const gymsColumns: ColumnDef<Gym>[] = [
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
      <div className="text-sm">{row.original.email || <span className="text-muted-foreground">N/A</span>}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.phoneNumber || <span className="text-muted-foreground">N/A</span>}</div>
    ),
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
    cell: ({ row }) => (
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
          <DropdownMenuItem asChild>
            <Link to={`/dashboard/gyms/${row.original.id}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

type GymsTableProps = {
  data: Gym[];
};

export function GymsTable({ data }: GymsTableProps) {
  return (
    <DataTable
      data={data}
      columns={gymsColumns}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
