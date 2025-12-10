import {
  IconBuildingStore,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconId,
  IconMapPin,
  IconReport,
  IconSearch,
  IconSettings,
  IconUser,
  IconUserCheck,
  IconUserStar,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "./nav-documents";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/logo";

const data = {
  user: {
    name: "Steph Crown",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Gym Owners",
      url: "/dashboard/gym-owners",
      icon: IconUserCheck,
    },
    {
      title: "Gyms",
      url: "/dashboard/gyms",
      icon: IconBuildingStore,
    },
    {
      title: "Locations",
      url: "/dashboard/locations",
      icon: IconMapPin,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Staff",
      url: "/dashboard/staff",
      icon: IconUser,
    },
    {
      title: "Members",
      url: "/dashboard/members",
      icon: IconUser,
    },
    {
      title: "Trainers",
      url: "/dashboard/trainers",
      icon: IconUserStar,
    },
    {
      title: "Memberships",
      url: "/dashboard/memberships",
      icon: IconId,
    },
    {
      title: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: IconCreditCard,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              {/* <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a> */}
              <Logo path="/dashboard" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
