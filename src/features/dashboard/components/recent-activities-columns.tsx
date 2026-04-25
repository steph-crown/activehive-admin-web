import { type ColumnDef } from "@tanstack/react-table";
import type { RecentActivity } from "../types";

export const recentActivitiesColumns: ColumnDef<RecentActivity>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.action}</div>
    ),
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.target}</div>
    ),
  },
  {
    accessorKey: "admin",
    header: "Admin",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.admin}</div>
    ),
  },
  {
    accessorKey: "when",
    header: "When",
    cell: ({ row }) => (
      <div className="text-sm">
        {new Date(row.original.when).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </div>
    ),
  },
];
