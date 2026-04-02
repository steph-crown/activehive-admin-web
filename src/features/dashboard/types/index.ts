export type RecentActivity = {
  id: number;
  action: string;
  target: string;
  admin: string;
  /** ISO 8601 timestamp */
  when: string;
  status: string;
};

export type DashboardStats = {
  totalUsers: number;
  totalGymOwners: number;
  totalStaff: number;
  totalMembers: number;
  totalTrainers: number;
  totalGyms: number;
  totalLocations: number;
  totalMemberships: number;
  totalSubscriptions: number;
  activeGyms: number;
  activeSubscriptions: number;
};
