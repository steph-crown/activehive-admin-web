import { type ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import type { User } from "../types";
import { roleDisplayMap } from "../types/role";

export const usersColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="font-medium">{row.original.email}</div>,
  },
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          {user.firstName} {user.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role as keyof typeof roleDisplayMap;
      const displayName = roleDisplayMap[role] || role;
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {displayName}
        </Badge>
      );
    },
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
    accessorKey: "ownedGyms",
    header: "Gyms",
    cell: ({ row }) => {
      const gyms = row.original.ownedGyms;
      return (
        <div className="text-sm">
          {gyms.length > 0 ? (
            <span>
              {gyms.length} gym{gyms.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-muted-foreground">No gyms</span>
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
      const date = new Date(row.original.createdAt);
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: () => (
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
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

type UsersTableProps = {
  data: User[];
};

export function UsersTable({ data }: UsersTableProps) {
  return (
    <DataTable
      data={data}
      columns={usersColumns}
      enableDrag={false}
      enableSelection={true}
      getRowId={(row) => row.id}
    />
  );
}
