import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useLocationsQuery } from "../services";
import type { Location } from "../types";
import { LocationsTable } from "./locations-table";
import { ConfirmLocationStatusDialog } from "./confirm-location-status-dialog";

type LocationActionType = "activate" | "deactivate";

export function LocationsPage() {
  const [statusAction, setStatusAction] = useState<{
    location: Location;
    type: LocationActionType;
  } | null>(null);
  const { data, isLoading, error } = useLocationsQuery();

  if (error) {
    console.error("Locations API Error:", error);
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-4">Locations</h1>

                <ConfirmLocationStatusDialog
                  location={statusAction?.location ?? null}
                  action={statusAction?.type ?? "deactivate"}
                  open={statusAction != null}
                  onOpenChange={(open) => {
                    if (!open) setStatusAction(null);
                  }}
                />

                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <BlockLoader />
                  </div>
                ) : error ? (
                  <div className="text-destructive">
                    Error loading locations. Check console for details.
                  </div>
                ) : data ? (
                  <LocationsTable
                    data={data}
                    onActivateLocation={(location) =>
                      setStatusAction({ location, type: "activate" })
                    }
                    onDeactivateLocation={(location) =>
                      setStatusAction({ location, type: "deactivate" })
                    }
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
