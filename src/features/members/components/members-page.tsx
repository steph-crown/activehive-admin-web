import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useMembersQuery } from "../services";
import type { Member } from "../types";
import { MembersTable } from "./members-table";
import { ViewMemberDialog } from "./view-member-dialog";

export function MembersPage() {
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const { data, isLoading, error } = useMembersQuery();

  if (data) {
    console.log("Members API Response:", data);
  }

  if (error) {
    console.error("Members API Error:", error);
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
                <h1 className="text-2xl font-bold mb-4">Members</h1>

                <ViewMemberDialog
                  member={viewMember}
                  open={viewMember != null}
                  onOpenChange={(open) => !open && setViewMember(null)}
                />

                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <BlockLoader />
                  </div>
                ) : error ? (
                  <div className="text-destructive">
                    Error loading members. Check console for details.
                  </div>
                ) : data ? (
                  <MembersTable
                    data={data}
                    onViewMember={(member) => setViewMember(member)}
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
