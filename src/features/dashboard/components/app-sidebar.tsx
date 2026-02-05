import {
  IconBuildingStore,
  IconCreditCard,
  IconDashboard,
  IconMapPin,
  IconShield,
  IconUser,
  IconUserCheck,
  IconUserStar,
} from "@tabler/icons-react";
import * as React from "react";

import { Logo } from "@/components/icons/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Admins",
      url: "/dashboard/admins",
      icon: IconShield,
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
    // {
    //   title: "Users",
    //   url: "/dashboard/users",
    //   icon: IconUsers,
    // },
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
      title: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: IconCreditCard,
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
