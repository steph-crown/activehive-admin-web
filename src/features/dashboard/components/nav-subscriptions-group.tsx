import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconChevronRight, IconCreditCard } from "@tabler/icons-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

function isSubscriptionPlansPath(pathname: string): boolean {
  return (
    pathname === "/dashboard/subscriptions/plans" ||
    /^\/dashboard\/subscriptions\/plans\/.+/.test(pathname)
  );
}

function isSubscriptionsListOrDetail(pathname: string): boolean {
  if (pathname === "/dashboard/subscriptions") return true;
  const m = /^\/dashboard\/subscriptions\/([^/]+)$/.exec(pathname);
  if (!m) return false;
  return m[1] !== "plans";
}

export function NavSubscriptionsGroup() {
  const { pathname } = useLocation();

  const subscriptionsChildActive = isSubscriptionsListOrDetail(pathname);
  const plansChildActive = isSubscriptionPlansPath(pathname);
  const groupActive = subscriptionsChildActive || plansChildActive;

  const [open, setOpen] = useState(groupActive);
  useEffect(() => {
    if (groupActive) setOpen(true);
  }, [groupActive]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <Collapsible
            asChild
            open={open}
            onOpenChange={setOpen}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Subscriptions">
                  <IconCreditCard />
                  <span>Subscriptions</span>
                  <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={subscriptionsChildActive}
                    >
                      <Link to="/dashboard/subscriptions">
                        <span>Subscriptions</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={plansChildActive}>
                      <Link to="/dashboard/subscriptions/plans">
                        <span>Subscription Plans</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
