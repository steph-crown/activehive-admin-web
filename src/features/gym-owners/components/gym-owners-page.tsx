import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useGymOwnersQuery } from "../services";
import type { GymOwner } from "../types";
import { GymOwnersTable } from "./gym-owners-table";
import { ViewGymOwnerDialog } from "./view-gym-owner-dialog";
import { EditGymOwnerDialog } from "./edit-gym-owner-dialog";
import { ConfirmGymOwnerStatusDialog } from "./confirm-gym-owner-status-dialog";

type GymOwnerActionType = "activate" | "deactivate";

export function GymOwnersPage() {
  const [viewOwner, setViewOwner] = useState<GymOwner | null>(null);
  const [editOwner, setEditOwner] = useState<GymOwner | null>(null);
  const [statusAction, setStatusAction] = useState<{
    owner: GymOwner;
    type: GymOwnerActionType;
  } | null>(null);
  const { data, isLoading, error } = useGymOwnersQuery();

  if (error) {
    console.error("Gym Owners API Error:", error);
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
                <h1 className="text-2xl font-bold mb-4">Gym Owners</h1>

                <ViewGymOwnerDialog
                  owner={viewOwner}
                  open={viewOwner != null}
                  onOpenChange={(open) => !open && setViewOwner(null)}
                />
                <EditGymOwnerDialog
                  owner={editOwner}
                  open={editOwner != null}
                  onOpenChange={(open) => {
                    if (!open) setEditOwner(null);
                  }}
                />
                <ConfirmGymOwnerStatusDialog
                  owner={statusAction?.owner ?? null}
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
                    Error loading gym owners. Check console for details.
                  </div>
                ) : data ? (
                  <GymOwnersTable
                    data={data}
                    onViewOwner={(owner) => setViewOwner(owner)}
                    onEditOwner={(owner) => setEditOwner(owner)}
                    onActivateOwner={(owner) =>
                      setStatusAction({ owner, type: "activate" })
                    }
                    onDeactivateOwner={(owner) =>
                      setStatusAction({ owner, type: "deactivate" })
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
