import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useGymsQuery } from "../services";
import type { Gym } from "../types";
import { GymsTable } from "./gyms-table";
import { ConfirmGymStatusDialog } from "./confirm-gym-status-dialog";

type GymActionType = "activate" | "deactivate";

export function GymsPage() {
  const [statusAction, setStatusAction] = useState<{
    gym: Gym;
    type: GymActionType;
  } | null>(null);
  const { data, isLoading, error } = useGymsQuery();

  if (error) {
    console.error("Gyms API Error:", error);
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
                <h1 className="text-2xl font-bold mb-4">Gyms</h1>

                <ConfirmGymStatusDialog
                  gym={statusAction?.gym ?? null}
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
                    Error loading gyms. Check console for details.
                  </div>
                ) : data ? (
                  <GymsTable
                    data={data}
                    onActivateGym={(gym) =>
                      setStatusAction({ gym, type: "activate" })
                    }
                    onDeactivateGym={(gym) =>
                      setStatusAction({ gym, type: "deactivate" })
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
