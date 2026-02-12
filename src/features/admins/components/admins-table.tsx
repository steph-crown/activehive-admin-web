/* eslint-disable react-refresh/only-export-components */
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import { formatDate } from "@/lib/utils";
import type { Admin } from "../types";

type AdminsColumnCallbacks = {
  onViewAdmin?: (admin: Admin) => void;
  onEditAdmin?: (admin: Admin) => void;
  onDeleteAdmin?: (admin: Admin) => void;
  onActivateAdmin?: (admin: Admin) => void;
  onDeactivateAdmin?: (admin: Admin) => void;
};

function makeAdminsColumns(
  callbacks: AdminsColumnCallbacks,
): ColumnDef<Admin>[] {
  const {
    onViewAdmin,
    onEditAdmin,
    onDeleteAdmin,
    onActivateAdmin,
    onDeactivateAdmin,
  } = callbacks;

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
        const admin = row.original;
        return (
          <div>
            {admin.firstName} {admin.lastName}
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.phoneNumber || (
            <span className="text-muted-foreground">N/A</span>
          )}
        </div>
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
        return (
          <div className="text-sm">{formatDate(row.original.createdAt)}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const admin = row.original;
        const isActive = admin.status === "active";
        const isPending = admin.status === "pending";
        const hasStatusActions =
          !isPending &&
          ((isActive && onDeactivateAdmin) || (!isActive && onActivateAdmin));
        const hasDelete = Boolean(onDeleteAdmin);

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
            <DropdownMenuContent align="end" className="w-40">
              {onViewAdmin && (
                <DropdownMenuItem onClick={() => onViewAdmin(admin)}>
                  View Details
                </DropdownMenuItem>
              )}
              {onEditAdmin && (
                <DropdownMenuItem onClick={() => onEditAdmin(admin)}>
                  Edit
                </DropdownMenuItem>
              )}
              {(hasStatusActions || hasDelete) && <DropdownMenuSeparator />}
              {hasStatusActions && isActive && onDeactivateAdmin && (
                <DropdownMenuItem onClick={() => onDeactivateAdmin(admin)}>
                  Deactivate
                </DropdownMenuItem>
              )}
              {hasStatusActions && !isActive && onActivateAdmin && (
                <DropdownMenuItem onClick={() => onActivateAdmin(admin)}>
                  Activate
                </DropdownMenuItem>
              )}
              {onDeleteAdmin && (
                <>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeleteAdmin(admin)}
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

type AdminsTableProps = {
  data: Admin[];
  onViewAdmin?: (admin: Admin) => void;
  onEditAdmin?: (admin: Admin) => void;
  onDeleteAdmin?: (admin: Admin) => void;
  onActivateAdmin?: (admin: Admin) => void;
  onDeactivateAdmin?: (admin: Admin) => void;
};

export function AdminsTable({
  data,
  onViewAdmin,
  onEditAdmin,
  onDeleteAdmin,
  onActivateAdmin,
  onDeactivateAdmin,
}: AdminsTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeAdminsColumns({
        onViewAdmin,
        onEditAdmin,
        onDeleteAdmin,
        onActivateAdmin,
        onDeactivateAdmin,
      })}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
