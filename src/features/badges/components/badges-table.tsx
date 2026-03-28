import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import type { BadgeCategory, PlatformBadge } from "../types";

const categoryLabel: Record<BadgeCategory, string> = {
  streak: "Streak",
  milestone: "Milestone",
  social: "Social",
  achievement: "Achievement",
};

const badgesColumns: ColumnDef<PlatformBadge>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-muted-foreground text-xs">{row.original.slug}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-2 max-w-[280px] text-sm">
        {row.original.description ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {categoryLabel[row.original.category]}
      </Badge>
    ),
  },
  {
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.original.points}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const active = row.original.status === "active";
      return (
        <Badge variant={active ? "default" : "secondary"}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
];

type BadgesTableProps = {
  readonly data: PlatformBadge[];
};

export function BadgesTable({ data }: BadgesTableProps) {
  return (
    <DataTable
      data={data}
      columns={badgesColumns}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
