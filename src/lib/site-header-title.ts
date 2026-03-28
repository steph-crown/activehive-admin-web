/** Default header label from URL when a page does not pass an explicit `title`. */
export function getDefaultSiteHeaderTitle(pathname: string): string {
  const p = pathname.replace(/\/$/, "") || "/";

  const exact: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/admins": "Admin Users",
    "/dashboard/users": "Users",
    "/dashboard/gym-owners": "Gym Owners",
    "/dashboard/gyms": "Gyms",
    "/dashboard/locations": "Locations",
    "/dashboard/staff": "Staff",
    "/dashboard/members": "Members",
    "/dashboard/trainers": "Trainers",
    "/dashboard/subscriptions": "Subscriptions",
    "/dashboard/challenges": "Challenges",
    "/profile": "Profile",
  };

  if (exact[p]) return exact[p];

  if (/^\/dashboard\/gyms\/[^/]+$/.test(p)) {
    return "Gym";
  }
  if (/^\/dashboard\/subscriptions\/plans\/[^/]+$/.test(p)) {
    return "Subscription plan";
  }
  if (/^\/dashboard\/subscriptions\/[^/]+$/.test(p)) {
    return "Subscription details";
  }

  return "Dashboard";
}
