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
import type { Staff } from "../types";

type StaffColumnCallbacks = {
  onViewStaff?: (staff: Staff) => void;
  onEditStaff?: (staff: Staff) => void;
  onDeleteStaff?: (staff: Staff) => void;
  onActivateStaff?: (staff: Staff) => void;
  onDeactivateStaff?: (staff: Staff) => void;
};

function makeStaffColumns(callbacks: StaffColumnCallbacks): ColumnDef<Staff>[] {
  const {
    onViewStaff,
    onEditStaff,
    onDeleteStaff,
    onActivateStaff,
    onDeactivateStaff,
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
        const staff = row.original;
        return (
          <div>
            {staff.firstName} {staff.lastName}
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
        const staff = row.original;
        const isActive = staff.status === "active";

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
              {onViewStaff && (
                <DropdownMenuItem onClick={() => onViewStaff(staff)}>
                  View Details
                </DropdownMenuItem>
              )}
              {onEditStaff && (
                <DropdownMenuItem onClick={() => onEditStaff(staff)}>
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {isActive && onDeactivateStaff && (
                <DropdownMenuItem onClick={() => onDeactivateStaff(staff)}>
                  Deactivate
                </DropdownMenuItem>
              )}
              {!isActive && onActivateStaff && (
                <DropdownMenuItem onClick={() => onActivateStaff(staff)}>
                  Activate
                </DropdownMenuItem>
              )}
              {onDeleteStaff && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeleteStaff(staff)}
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

type StaffTableProps = {
  data: Staff[];
  onViewStaff?: (staff: Staff) => void;
  onEditStaff?: (staff: Staff) => void;
  onDeleteStaff?: (staff: Staff) => void;
  onActivateStaff?: (staff: Staff) => void;
  onDeactivateStaff?: (staff: Staff) => void;
};

export function StaffTable({
  data,
  onViewStaff,
  onEditStaff,
  onDeleteStaff,
  onActivateStaff,
  onDeactivateStaff,
}: StaffTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeStaffColumns({
        onViewStaff,
        onEditStaff,
        onDeleteStaff,
        onActivateStaff,
        onDeactivateStaff,
      })}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
