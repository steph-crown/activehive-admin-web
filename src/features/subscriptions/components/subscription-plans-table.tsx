import { Link } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { IconDotsVertical } from "@tabler/icons-react";

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
import type { SubscriptionPlan } from "../types";

type SubscriptionPlansColumnCallbacks = {
  onEditPlan?: (plan: SubscriptionPlan) => void;
  onDeletePlan?: (plan: SubscriptionPlan) => void;
  /** @default true */
  showPopularColumn?: boolean;
};

const makeSubscriptionPlansColumns = (
  callbacks: SubscriptionPlansColumnCallbacks,
): ColumnDef<SubscriptionPlan>[] => {
  const {
    onEditPlan,
    onDeletePlan,
    showPopularColumn = true,
  } = callbacks;

  const popularColumn: ColumnDef<SubscriptionPlan> = {
    accessorKey: "isPopular",
    header: "Popular",
    cell: ({ row }) => (
      <Badge variant={row.original.isPopular ? "default" : "secondary"}>
        {row.original.isPopular ? "Yes" : "No"}
      </Badge>
    ),
  };

  const columns: ColumnDef<SubscriptionPlan>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.description ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "planType",
    header: "Plan Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.planType.replace("_", " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price;
      const num = Number(price);
      return (
        <span className="text-sm">
          {Number.isFinite(num) ? `₦${num.toFixed(2)}` : price}
        </span>
      );
    },
  },
  {
    accessorKey: "billingPeriod",
    header: "Billing",
    cell: ({ row }) => (
      <span className="capitalize text-sm">
        {row.original.billingPeriod ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "trialDays",
    header: "Trial Days",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.trialDays != null ? row.original.trialDays : "—"}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const plan = row.original;

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
              <Link to={`/dashboard/subscriptions/plans/${plan.id}`}>
                View
              </Link>
            </DropdownMenuItem>
            {onEditPlan && (
              <DropdownMenuItem onClick={() => onEditPlan(plan)}>
                Edit
              </DropdownMenuItem>
            )}
            {onDeletePlan && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDeletePlan(plan)}
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

  if (showPopularColumn) {
    const actionsIndex = columns.findIndex((c) => c.id === "actions");
    columns.splice(actionsIndex, 0, popularColumn);
  }

  return columns;
};

type SubscriptionPlansTableProps = {
  readonly data: SubscriptionPlan[];
  readonly onEditPlan?: (plan: SubscriptionPlan) => void;
  readonly onDeletePlan?: (plan: SubscriptionPlan) => void;
  readonly showPopularColumn?: boolean;
};

export function SubscriptionPlansTable({
  data,
  onEditPlan,
  onDeletePlan,
  showPopularColumn = true,
}: SubscriptionPlansTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeSubscriptionPlansColumns({
        onEditPlan,
        onDeletePlan,
        showPopularColumn,
      })}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
