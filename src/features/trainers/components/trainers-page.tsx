import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useTrainersQuery } from "../services";
import type { Trainer } from "../types";
import { TrainersTable } from "./trainers-table";
import { ViewTrainerDialog } from "./view-trainer-dialog";
import { EditTrainerDialog } from "./edit-trainer-dialog";
import { ConfirmTrainerActionDialog } from "./confirm-trainer-action-dialog";

export function TrainersPage() {
  const [viewTrainer, setViewTrainer] = useState<Trainer | null>(null);
  const [editTrainer, setEditTrainer] = useState<Trainer | null>(null);
  const [action, setAction] = useState<{
    trainer: Trainer;
    action: "delete" | "activate" | "deactivate";
  } | null>(null);
  const { data, isLoading, error } = useTrainersQuery();

  if (data) {
    console.log("Trainers API Response:", data);
  }

  if (error) {
    console.error("Trainers API Error:", error);
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
                <h1 className="text-2xl font-bold mb-4">Trainers</h1>

                <ViewTrainerDialog
                  trainer={viewTrainer}
                  open={viewTrainer != null}
                  onOpenChange={(open) => !open && setViewTrainer(null)}
                />
                <EditTrainerDialog
                  trainer={editTrainer}
                  open={editTrainer != null}
                  onOpenChange={(open) => !open && setEditTrainer(null)}
                />
                <ConfirmTrainerActionDialog
                  trainer={action?.trainer ?? null}
                  action={action?.action ?? "deactivate"}
                  open={action != null}
                  onOpenChange={(open) => {
                    if (!open) {
                      setAction(null);
                    }
                  }}
                />

                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <BlockLoader />
                  </div>
                ) : error ? (
                  <div className="text-destructive">
                    Error loading trainers. Check console for details.
                  </div>
                ) : data ? (
                  <TrainersTable
                    data={data}
                    onViewTrainer={(trainer) => setViewTrainer(trainer)}
                    onEditTrainer={(trainer) => setEditTrainer(trainer)}
                    onDeleteTrainer={(trainer) =>
                      setAction({ trainer, action: "delete" })
                    }
                    onActivateTrainer={(trainer) =>
                      setAction({ trainer, action: "activate" })
                    }
                    onDeactivateTrainer={(trainer) =>
                      setAction({ trainer, action: "deactivate" })
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
