import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";

type LocationDetailPageProps = {
  locationId: string;
};

export function LocationDetailPage({ locationId }: LocationDetailPageProps) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/locations">← Back to Locations</Link>
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Location Details</CardTitle>
                    <CardDescription>
                      Location ID: {locationId} — placeholder content. Full details will be displayed here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm">
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Name</span>
                      <p className="font-medium">—</p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Address</span>
                      <p className="font-medium">—</p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Phone</span>
                      <p className="font-medium">—</p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Email</span>
                      <p className="font-medium">—</p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Status</span>
                      <p className="font-medium">—</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
