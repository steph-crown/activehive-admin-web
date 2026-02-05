/* eslint-disable react-refresh/only-export-components */
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
import type { Subscription } from "../types";

export const subscriptionsColumns: ColumnDef<Subscription>[] = [
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
    cell: ({ row }) => {
      const plan = row.original.plan;
      if (plan == null || plan === "") {
        return <span className="text-muted-foreground">—</span>;
      }
      return (
        <Badge
          variant="outline"
          className="text-muted-foreground px-1.5 capitalize"
        >
          {plan}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant="outline"
          className="text-muted-foreground px-1.5 capitalize"
        >
          {status === "active" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "monthlyPrice",
    header: "Monthly Price",
    cell: ({ row }) => {
      const price = row.original.monthlyPrice;
      if (price == null || price === "") {
        return <span className="text-muted-foreground">—</span>;
      }
      const num = Number(price);
      return (
        <div className="text-sm">
          {Number.isFinite(num) ? `$${num.toFixed(2)}` : price}
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
            <Link to={`/dashboard/subscriptions/${row.original.id}`}>
              View Details
            </Link>
          </DropdownMenuItem>
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
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
