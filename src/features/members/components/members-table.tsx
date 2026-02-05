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
import type { Member } from "../types";

function makeMembersColumns(onViewMember: (member: Member) => void): ColumnDef<Member>[] {
  return [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div>
          {member.firstName} {member.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.phoneNumber || <span className="text-muted-foreground">N/A</span>}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "active" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "memberships",
    header: "Memberships",
    cell: ({ row }) => {
      const memberships = row.original.memberships;
      return (
        <div className="text-sm">
          {Array.isArray(memberships) && memberships.length > 0 ? (
            <span>
              {memberships.length} membership{memberships.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-muted-foreground">No memberships</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isEmailVerified",
    header: "Email Verified",
    cell: ({ row }) => (
      <Badge variant={row.original.isEmailVerified ? "default" : "secondary"}>
        {row.original.isEmailVerified ? "Verified" : "Not Verified"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return <div className="text-sm">{formatDate(row.original.createdAt)}</div>;
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
          <DropdownMenuItem onClick={() => onViewMember(row.original)}>
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
}

type MembersTableProps = {
  data: Member[];
  onViewMember?: (member: Member) => void;
};

export function MembersTable({ data, onViewMember }: MembersTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeMembersColumns(onViewMember ?? (() => {}))}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
