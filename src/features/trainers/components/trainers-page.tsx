import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useTrainersQuery } from "../services";
import { TrainersTable } from "./trainers-table";

export function TrainersPage() {
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

                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <BlockLoader />
                  </div>
                ) : error ? (
                  <div className="text-destructive">
                    Error loading trainers. Check console for details.
                  </div>
                ) : data ? (
                  <TrainersTable data={data} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
