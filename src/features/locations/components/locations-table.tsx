import { Link } from "react-router-dom";
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
import type { Location } from "../types";

type LocationsTableCallbacks = {
  onActivateLocation?: (location: Location) => void;
  onDeactivateLocation?: (location: Location) => void;
};

function makeLocationsColumns({
  onActivateLocation,
  onDeactivateLocation,
}: LocationsTableCallbacks): ColumnDef<Location>[] {
  return [
  {
    accessorKey: "locationName",
    header: "Location Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.locationName}</div>
    ),
  },
  {
    accessorKey: "gym",
    header: "Gym",
    cell: ({ row }) => {
      const gym = row.original.gym;
      if (!gym) return <span className="text-muted-foreground">N/A</span>;
      return <div>{gym.name}</div>;
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address;
      if (!address) return <span className="text-muted-foreground">N/A</span>;
      return (
        <div className="text-sm">
          {address.street}, {address.city}, {address.state} {address.zipCode}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.email || <span className="text-muted-foreground">N/A</span>}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.phone || <span className="text-muted-foreground">N/A</span>}</div>
    ),
  },
  {
    accessorKey: "isHeadquarters",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.original.isHeadquarters ? "default" : "secondary"}>
        {row.original.isHeadquarters ? "Headquarters" : "Branch"}
      </Badge>
    ),
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
    accessorKey: "staff",
    header: "Staff",
    cell: ({ row }) => {
      const staff = row.original.staff;
      return (
        <div className="text-sm">
          {Array.isArray(staff) && staff.length > 0 ? (
            <span>
              {staff.length} staff member{staff.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-muted-foreground">No staff</span>
          )}
        </div>
      );
    },
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
    cell: ({ row }) => {
      const location = row.original;
      const isActive = location.isActive;

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
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/locations/${location.id}`}>View Details</Link>
            </DropdownMenuItem>
            {isActive && onDeactivateLocation && (
              <DropdownMenuItem onClick={() => onDeactivateLocation(location)}>
                Deactivate
              </DropdownMenuItem>
            )}
            {!isActive && onActivateLocation && (
              <DropdownMenuItem onClick={() => onActivateLocation(location)}>
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

type LocationsTableProps = {
  data: Location[];
  onActivateLocation?: (location: Location) => void;
  onDeactivateLocation?: (location: Location) => void;
};

export function LocationsTable({
  data,
  onActivateLocation,
  onDeactivateLocation,
}: LocationsTableProps) {
  return (
    <DataTable
      data={data}
      columns={makeLocationsColumns({ onActivateLocation, onDeactivateLocation })}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
    />
  );
}
