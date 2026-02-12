import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useStaffQuery } from "../services";
import type { Staff } from "../types";
import { StaffTable } from "./staff-table";
import { ViewStaffDialog } from "./view-staff-dialog";
import { EditStaffDialog } from "./edit-staff-dialog";
import { ConfirmStaffActionDialog } from "./confirm-staff-action-dialog";

export function StaffPage() {
  const [viewStaff, setViewStaff] = useState<Staff | null>(null);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [action, setAction] = useState<{
    staff: Staff;
    action: "delete" | "activate" | "deactivate";
  } | null>(null);
  const { data, isLoading, error } = useStaffQuery();

  if (data) {
    console.log("Staff API Response:", data);
  }

  if (error) {
    console.error("Staff API Error:", error);
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
                <h1 className="text-2xl font-bold mb-4">Staff</h1>

                <ViewStaffDialog
                  staff={viewStaff}
                  open={viewStaff != null}
                  onOpenChange={(open) => !open && setViewStaff(null)}
                />
                <EditStaffDialog
                  staff={editStaff}
                  open={editStaff != null}
                  onOpenChange={(open) => !open && setEditStaff(null)}
                />
                <ConfirmStaffActionDialog
                  staff={action?.staff ?? null}
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
                    Error loading staff. Check console for details.
                  </div>
                ) : data ? (
                  <StaffTable
                    data={data}
                    onViewStaff={(staff) => setViewStaff(staff)}
                    onEditStaff={(staff) => setEditStaff(staff)}
                    onDeleteStaff={(staff) =>
                      setAction({ staff, action: "delete" })
                    }
                    onActivateStaff={(staff) =>
                      setAction({ staff, action: "activate" })
                    }
                    onDeactivateStaff={(staff) =>
                      setAction({ staff, action: "deactivate" })
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
