import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import type { SubscriptionPlan } from "../types";

const subscriptionPlansColumns: ColumnDef<SubscriptionPlan>[] = [
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
          {Number.isFinite(num) ? `$${num.toFixed(2)}` : price}
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
    accessorKey: "isPopular",
    header: "Popular",
    cell: ({ row }) => (
      <Badge variant={row.original.isPopular ? "default" : "secondary"}>
        {row.original.isPopular ? "Yes" : "No"}
      </Badge>
    ),
  },
];

type SubscriptionPlansTableProps = {
  data: SubscriptionPlan[];
};

export function SubscriptionPlansTable({ data }: SubscriptionPlansTableProps) {
  return (
    <DataTable
      data={data}
      columns={subscriptionPlansColumns}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
