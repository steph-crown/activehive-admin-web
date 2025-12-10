/* eslint-disable react-refresh/only-export-components */
import { type ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import { formatDate } from "@/lib/utils";
import type { Subscription } from "../types";

export const subscriptionsColumns: ColumnDef<Subscription>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "gym",
    header: "Gym",
    cell: ({ row }) => {
      const gym = row.original.gym;
      if (!gym) return <span className="text-muted-foreground">N/A</span>;
      return <div className="font-medium">{gym.name}</div>;
    },
  },
  {
    accessorKey: "gymOwner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.original.gymOwner;
      if (!owner) return <span className="text-muted-foreground">N/A</span>;
      return (
        <div>
          {owner.firstName} {owner.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-muted-foreground px-1.5 capitalize"
      >
        {row.original.plan}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-muted-foreground px-1.5 capitalize"
      >
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
    accessorKey: "monthlyPrice",
    header: "Monthly Price",
    cell: ({ row }) => {
      const price = row.original.monthlyPrice;
      return (
        <div className="text-sm">
          {price !== null ? (
            `$${price.toFixed(2)}`
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "trialEndDate",
    header: "Trial Ends",
    cell: ({ row }) => {
      const date = row.original.trialEndDate;
      if (!date) return <span className="text-muted-foreground">N/A</span>;
      return <div className="text-sm">{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "subscriptionEndDate",
    header: "Subscription Ends",
    cell: ({ row }) => {
      const date = row.original.subscriptionEndDate;
      if (!date) return <span className="text-muted-foreground">N/A</span>;
      return <div className="text-sm">{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "autoRenew",
    header: "Auto Renew",
    cell: ({ row }) => (
      <Badge variant={row.original.autoRenew ? "default" : "secondary"}>
        {row.original.autoRenew ? "Yes" : "No"}
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
    cell: () => (
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
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

type SubscriptionsTableProps = {
  data: Subscription[];
};

export function SubscriptionsTable({ data }: SubscriptionsTableProps) {
  return (
    <DataTable
      data={data}
      columns={subscriptionsColumns}
      enableDrag={false}
      enableSelection={true}
      getRowId={(row) => row.id}
    />
  );
}
