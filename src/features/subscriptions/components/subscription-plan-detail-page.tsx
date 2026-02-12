import { useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlockLoader } from "@/components/loader/block-loader";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useSubscriptionPlanDetailQuery } from "../services";

export function SubscriptionPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useSubscriptionPlanDetailQuery(id);

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center py-10">
            <BlockLoader />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !data) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="px-4 lg:px-6 py-6">
            <p className="text-destructive">
              Failed to load subscription plan.{" "}
              {error instanceof Error ? error.message : "Please try again."}
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const plan = data;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold">{plan.name}</h1>
                    <p className="text-muted-foreground text-sm">
                      Platform subscription plan details
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {plan.planType.replace("_", " ")}
                  </Badge>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Plan details</CardTitle>
                    <CardDescription>Overview and configuration.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm">
                    {plan.description && (
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Description</span>
                        <p className="font-medium">{plan.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Price</span>
                        <p className="font-medium">
                          ${Number(plan.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">
                          Billing period
                        </span>
                        <p className="font-medium capitalize">
                          {plan.billingPeriod}
                        </p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Trial days</span>
                        <p className="font-medium">
                          {plan.trialDays != null ? plan.trialDays : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Active</span>
                        <Badge variant={plan.isActive ? "default" : "secondary"}>
                          {plan.isActive ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Default</span>
                        <Badge variant={plan.isDefault ? "default" : "secondary"}>
                          {plan.isDefault ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Popular</span>
                        <Badge variant={plan.isPopular ? "default" : "secondary"}>
                          {plan.isPopular ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Sort order</span>
                      <p className="font-medium">
                        {plan.sortOrder != null ? plan.sortOrder : "—"}
                      </p>
                    </div>
                    {plan.features && plan.features.length > 0 && (
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Features</span>
                        <ul className="list-disc list-inside text-sm">
                          {plan.features.map((feature) => (
                            <li key={feature}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Later sections for analytics, usage, etc. can be added here */}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

