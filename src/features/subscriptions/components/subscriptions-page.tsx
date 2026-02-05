import { type ColumnDef } from "@tanstack/react-table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useSubscriptionsQuery } from "../services";
import { SubscriptionsTable } from "./subscriptions-table";

const subscriptionPlansColumns: ColumnDef<{ id: string; name: string }>[] = [
  { accessorKey: "name", header: "Name" },
];

export function SubscriptionsPage() {
  const { data, isLoading, error } = useSubscriptionsQuery();

  if (data) {
    console.log("Subscriptions API Response:", data);
  }

  if (error) {
    console.error("Subscriptions API Error:", error);
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
                <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>

                <Tabs defaultValue="subscriptions" className="w-full">
                  <TabsList>
                    <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                    <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
                  </TabsList>
                  <TabsContent value="subscriptions" className="mt-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <BlockLoader />
                      </div>
                    ) : error ? (
                      <div className="text-destructive">
                        Error loading subscriptions. Check console for details.
                      </div>
                    ) : data ? (
                      <SubscriptionsTable data={data} />
                    ) : null}
                  </TabsContent>
                  <TabsContent value="plans" className="mt-4">
                    <DataTable
                      data={[] as { id: string; name: string }[]}
                      columns={subscriptionPlansColumns}
                      enableDrag={false}
                      enableSelection={false}
                      getRowId={(row) => row.id}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
