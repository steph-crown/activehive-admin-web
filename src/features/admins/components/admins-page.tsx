import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useAdminsQuery } from "../services";
import type { Admin } from "../types";
import { AdminsTable } from "./admins-table";
import { CreateAdminDialog } from "./create-admin-dialog";

export function AdminsPage() {
  const [viewAdmin, setViewAdmin] = useState<Admin | null>(null);
  const { data, isLoading, error } = useAdminsQuery();

  if (data) {
    console.log("Admins API Response:", data);
  }

  if (error) {
    console.error("Admins API Error:", error);
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
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Admins</h1>
                  <CreateAdminDialog
                    viewAdmin={viewAdmin}
                    onViewClose={() => setViewAdmin(null)}
                  />
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <BlockLoader />
                  </div>
                ) : error ? (
                  <div className="text-destructive">
                    Error loading admins. Check console for details.
                  </div>
                ) : data ? (
                  <AdminsTable
                    data={data}
                    onViewAdmin={(admin) => setViewAdmin(admin)}
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
