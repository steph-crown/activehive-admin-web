import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import {
  challengeDurationLabel,
  challengeStatusBadgeVariant,
  challengeTypeLabel,
  formatChallengeSchedule,
} from "../lib/challenge-display";
import type { ChallengeStatus, PlatformChallenge } from "../types";

const challengesColumns: ColumnDef<PlatformChallenge>[] = [
  {
    accessorKey: "name",
    header: "Challenge",
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
      <span className="text-muted-foreground line-clamp-2 max-w-[240px] text-sm">
        {row.original.description ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{challengeTypeLabel[row.original.type]}</Badge>
    ),
  },
  {
    id: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-sm">
        {challengeDurationLabel(row.original.startsAt, row.original.endsAt)}
      </span>
    ),
  },
  {
    accessorKey: "rewardPoints",
    header: "Reward",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">
        {row.original.rewardPoints.toLocaleString()} pts
      </span>
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s: ChallengeStatus = row.original.status;
      return (
        <Badge variant={challengeStatusBadgeVariant(s)} className="capitalize">
          {s.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    id: "schedule",
    header: "Schedule",
    cell: ({ row }) => (
      <span className="text-muted-foreground max-w-[200px] text-sm whitespace-normal">
        {formatChallengeSchedule(row.original.startsAt, row.original.endsAt)}
      </span>
    ),
  },
];

type ChallengesTableProps = {
  readonly data: PlatformChallenge[];
};

export function ChallengesTable({ data }: ChallengesTableProps) {
  return (
    <DataTable
      data={data}
      columns={challengesColumns}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
