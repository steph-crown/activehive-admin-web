import { Link } from "react-router-dom";
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
import { formatDate } from "@/lib/utils";
import { useProfileQuery } from "../services";
import type { ProfileOwnedGym } from "../types";

function formatAddress(address: ProfileOwnedGym["address"]): string {
  if (!address) return "—";
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);
  return parts.join(", ") || "—";
}

export function ProfilePage() {
  const { data: profile, isLoading, error } = useProfileQuery();

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

  if (error || !profile) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="px-4 lg:px-6 py-6">
            <p className="text-destructive">
              Failed to load profile. {error instanceof Error ? error.message : "Please try again."}
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const ownedGyms = profile.ownedGyms ?? [];

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 space-y-6">
                <h1 className="text-2xl font-bold">Profile</h1>

                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm">
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Name</span>
                      <p className="font-medium">
                        {profile.firstName} {profile.lastName}
                      </p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Email</span>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Phone</span>
                      <p className="font-medium">{profile.phoneNumber ?? "—"}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Role</span>
                        <Badge variant="outline" className="w-fit">
                          {profile.role}
                        </Badge>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="w-fit">
                          {profile.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Email verified</span>
                      <p className="font-medium">
                        {profile.isEmailVerified ? "Verified" : "Not verified"}
                      </p>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">Onboarding</span>
                      <p className="font-medium">
                        {profile.onboardingCompleted ? "Completed" : "Pending"}
                      </p>
                    </div>
                    {profile.dateOfBirth && (
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Date of birth</span>
                        <p className="font-medium">{formatDate(profile.dateOfBirth)}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Created</span>
                        <p className="font-medium">{formatDate(profile.createdAt)}</p>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-muted-foreground">Updated</span>
                        <p className="font-medium">{formatDate(profile.updatedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {ownedGyms.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Owned gyms</CardTitle>
                      <CardDescription>Gyms you own</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {ownedGyms.map((gym) => (
                          <li
                            key={gym.id}
                            className="rounded-lg border border-border p-3 text-sm"
                          >
                            <Link
                              to={`/dashboard/gyms/${gym.id}`}
                              className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                              {gym.name}
                            </Link>
                            {gym.address && (
                              <p className="text-muted-foreground mt-1">
                                {formatAddress(gym.address)}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
