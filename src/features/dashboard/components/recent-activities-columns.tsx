import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import type { RecentActivity } from "../types";

function statusVariant(status: string): "default" | "secondary" | "destructive" {
  const s = status.toLowerCase();
  if (
    s === "success" ||
    s === "completed" ||
    s === "done" ||
    s === "active"
  ) {
    return "default";
  }
  if (s === "pending" || s === "in process" || s === "in_progress") {
    return "secondary";
  }
  return "destructive";
}

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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
];
