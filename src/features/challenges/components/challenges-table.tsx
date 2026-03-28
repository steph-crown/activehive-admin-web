import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { IconDotsVertical } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  challengeDurationLabel,
  challengeStatusBadgeVariant,
  challengeTypeLabel,
  formatChallengeSchedule,
} from "../lib/challenge-display";
import type { ChallengeStatus, PlatformChallenge } from "../types";

type ChallengeRowActionsProps = {
  readonly challenge: PlatformChallenge;
  readonly onEdit: (challenge: PlatformChallenge) => void;
  readonly onDelete: (challenge: PlatformChallenge) => void;
};

function ChallengeRowActions({
  challenge,
  onEdit,
  onDelete,
}: ChallengeRowActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
          aria-label="Open challenge actions"
        >
          <IconDotsVertical className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            className={cn(
              "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none",
            )}
            onClick={() => {
              onEdit(challenge);
              setOpen(false);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className={cn(
              "focus:bg-accent relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none",
              "text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive",
            )}
            onClick={() => {
              onDelete(challenge);
              setOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type ChallengesColumnCallbacks = {
  readonly onEditChallenge: (challenge: PlatformChallenge) => void;
  readonly onDeleteChallenge: (challenge: PlatformChallenge) => void;
};

const makeChallengesColumns = (
  callbacks: ChallengesColumnCallbacks,
): ColumnDef<PlatformChallenge>[] => {
  const { onEditChallenge, onDeleteChallenge } = callbacks;

  return [
    {
      accessorKey: "name",
      header: "Challenge",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.slug}
          </span>
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
    {
      id: "actions",
      cell: ({ row }) => (
        <ChallengeRowActions
          challenge={row.original}
          onEdit={onEditChallenge}
          onDelete={onDeleteChallenge}
        />
      ),
    },
  ];
};

type ChallengesTableProps = {
  readonly data: PlatformChallenge[];
  readonly onEditChallenge: (challenge: PlatformChallenge) => void;
  readonly onDeleteChallenge: (challenge: PlatformChallenge) => void;
};

export function ChallengesTable({
  data,
  onEditChallenge,
  onDeleteChallenge,
}: ChallengesTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeChallengesColumns({
        onEditChallenge,
        onDeleteChallenge,
      })}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
