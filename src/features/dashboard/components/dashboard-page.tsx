import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { DataTable } from "@/components/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";
import { SectionCards } from "./section-cards";
import { ChartAreaInteractive } from "./chart-area-interactive";
import { dashboardColumns } from "./dashboard-columns";
import { useDashboardDocumentsQuery } from "../services";

export function DashboardPage() {
  const { data, isLoading } = useDashboardDocumentsQuery();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {isLoading || !data ? (
                <div className="flex items-center justify-center py-10">
                  <BlockLoader />
                </div>
              ) : (
                <Tabs
                  defaultValue="outline"
                  className="w-full flex-col justify-start gap-6"
                >
                  <div className="flex items-center justify-between px-4 lg:px-6">
                    <Label htmlFor="view-selector" className="sr-only">
                      View
                    </Label>
                    <Select defaultValue="outline">
                      <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="view-selector"
                      >
                        <SelectValue placeholder="Select a view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="past-performance">Past Performance</SelectItem>
                        <SelectItem value="key-personnel">Key Personnel</SelectItem>
                        <SelectItem value="focus-documents">Focus Documents</SelectItem>
                      </SelectContent>
                    </Select>
                    <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                      <TabsTrigger value="outline">Outline</TabsTrigger>
                      <TabsTrigger value="past-performance">
                        Past Performance <Badge variant="secondary">3</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="key-personnel">
                        Key Personnel <Badge variant="secondary">2</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <IconPlus />
                        <span className="hidden lg:inline">Add Section</span>
                      </Button>
                    </div>
                  </div>
                  <TabsContent
                    value="outline"
                    className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
                  >
                    <DataTable
                      data={data}
                      columns={dashboardColumns}
                      enableDrag={true}
                      enableSelection={true}
                      getRowId={(row) => row.id.toString()}
                    />
                  </TabsContent>
                  <TabsContent
                    value="past-performance"
                    className="flex flex-col px-4 lg:px-6"
                  >
                    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
                  </TabsContent>
                  <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
                  </TabsContent>
                  <TabsContent
                    value="focus-documents"
                    className="flex flex-col px-4 lg:px-6"
                  >
                    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
