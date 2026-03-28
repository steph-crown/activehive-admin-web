import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import type {
  LeaderboardMetric,
  LeaderboardPeriod,
  LeaderboardScope,
  LeaderboardStatus,
  PlatformLeaderboard,
} from "../types";

const scopeLabel: Record<LeaderboardScope, string> = {
  platform: "Platform",
  gym: "Gym",
};

const metricLabel: Record<LeaderboardMetric, string> = {
  points: "Points",
  visits: "Visits",
  classes: "Classes",
};

const periodLabel: Record<LeaderboardPeriod, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  all_time: "All time",
};

function statusVariant(
  status: LeaderboardStatus,
): "default" | "secondary" | "outline" {
  if (status === "live") return "default";
  if (status === "draft") return "secondary";
  return "outline";
}

const leaderboardsColumns: ColumnDef<PlatformLeaderboard>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-muted-foreground line-clamp-1 max-w-[320px] text-xs">
          {row.original.description ?? "—"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "scope",
    header: "Scope",
    cell: ({ row }) => (
      <Badge variant="outline">{scopeLabel[row.original.scope]}</Badge>
    ),
  },
  {
    accessorKey: "metric",
    header: "Metric",
    cell: ({ row }) => (
      <span className="text-sm">{metricLabel[row.original.metric]}</span>
    ),
  },
  {
    accessorKey: "period",
    header: "Period",
    cell: ({ row }) => (
      <span className="text-sm">{periodLabel[row.original.period]}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)} className="capitalize">
        {row.original.status.replace("_", " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "participantCount",
    header: "Participants",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">
        {row.original.participantCount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.original.updatedAt).toLocaleDateString()}
      </span>
    ),
  },
];

type LeaderboardsTableProps = {
  readonly data: PlatformLeaderboard[];
};

export function LeaderboardsTable({ data }: LeaderboardsTableProps) {
  return (
    <DataTable
      data={data}
      columns={leaderboardsColumns}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
