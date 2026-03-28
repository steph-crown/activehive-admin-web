import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";

export function ChallengesPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="mb-1 text-3xl font-bold">Challenges</h1>
                <p className="text-muted-foreground mb-6 text-sm">
                  View and manage platform challenges across gyms.
                </p>
                <p className="text-muted-foreground rounded-md border border-[#F4F4F4] bg-white p-8 text-center text-sm">
                  Challenge listings will appear here when the API is available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
