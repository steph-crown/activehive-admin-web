import { Link } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";
import { CornerDownRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import { cn, formatDate } from "@/lib/utils";
import type { GymListRow } from "../lib/gym-list-display";

function gymShowsApplicationActions(gym: GymListRow): boolean {
  return gym.approvalStatus === "pending" || gym.approvalStatus == null;
}

type GymsTableCallbacks = {
  onActivateGym?: (gym: GymListRow) => void;
  onDeactivateGym?: (gym: GymListRow) => void;
  onApproveApplication?: (gym: GymListRow) => void;
  onRejectApplication?: (gym: GymListRow) => void;
};

function makeGymsColumns({
  onActivateGym,
  onDeactivateGym,
  onApproveApplication,
  onRejectApplication,
}: GymsTableCallbacks): ColumnDef<GymListRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Gym Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.original.owner;
        if (!owner) return <span className="text-muted-foreground">N/A</span>;
        return (
          <div>
            {owner.firstName} {owner.lastName}
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Location",
      cell: ({ row }) => {
        const address = row.original.address;
        if (!address) return <span className="text-muted-foreground">N/A</span>;
        return (
          <div className="text-sm">
            {address.city}, {address.state}
          </div>
        );
      },
    },
    {
      accessorKey: "displayRevenue",
      header: "Revenue",
      cell: ({ row }) => (
        <div className="text-sm font-medium">{row.original.displayRevenue}</div>
      ),
    },
    {
      accessorKey: "displayPlanLabel",
      header: "Plans",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal capitalize">
          {row.original.displayPlanLabel}
        </Badge>
      ),
    },
    {
      accessorKey: "approvalStatus",
      header: "Approval Status",
      cell: ({ row }) => {
        const status = row.original.approvalStatus;
        if (!status) {
          return <span className="text-muted-foreground text-sm">N/A</span>;
        }

        return (
          <Badge
            variant="outline"
            className={cn(
              "capitalize text-xs px-2 py-0.5",
              status === "approved" &&
                "border-emerald-200 bg-emerald-50 text-emerald-700",
              status === "rejected" &&
                "border-destructive/30 bg-destructive/10 text-destructive",
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.isActive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader />
          )}
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "members",
      accessorFn: (row) => row.displayMemberTotal,
      header: () => (
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Members
        </span>
      ),
      cell: ({ row }) => {
        const total = row.original.displayMemberTotal;
        const active = row.original.displayMemberActive;
        const showActiveLine = active > 0;

        return (
          <div className="flex flex-col items-start gap-0.5 text-left">
            <span className="font-bold text-foreground">{total}</span>
            {showActiveLine && (
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <CornerDownRight
                  className="size-3.5 shrink-0 opacity-70"
                  aria-hidden
                />
                {active} active
              </span>
            )}
          </div>
        );
      },
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
      cell: ({ row }) => {
        const gym = row.original;
        const isActive = gym.isActive;
        const canToggleStatus = gym.approvalStatus === "approved";
        const showAppActions =
          gymShowsApplicationActions(gym) &&
          onApproveApplication &&
          onRejectApplication;

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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/gyms/${gym.id}`}>View Details</Link>
              </DropdownMenuItem>
              {showAppActions && (
                <>
                  <DropdownMenuItem
                    onClick={() => onApproveApplication(gym)}
                  >
                    Approve application
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onRejectApplication(gym)}
                  >
                    Reject application
                  </DropdownMenuItem>
                </>
              )}
              {canToggleStatus && isActive && onDeactivateGym && (
                <DropdownMenuItem onClick={() => onDeactivateGym(gym)}>
                  Deactivate
                </DropdownMenuItem>
              )}
              {canToggleStatus && !isActive && onActivateGym && (
                <DropdownMenuItem onClick={() => onActivateGym(gym)}>
                  Activate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

type GymsTableProps = {
  data: GymListRow[];
  onActivateGym?: (gym: GymListRow) => void;
  onDeactivateGym?: (gym: GymListRow) => void;
  onApproveApplication?: (gym: GymListRow) => void;
  onRejectApplication?: (gym: GymListRow) => void;
};

export function GymsTable({
  data,
  onActivateGym,
  onDeactivateGym,
  onApproveApplication,
  onRejectApplication,
}: GymsTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeGymsColumns({
        onActivateGym,
        onDeactivateGym,
        onApproveApplication,
        onRejectApplication,
      })}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
