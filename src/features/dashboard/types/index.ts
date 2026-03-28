export type RecentActivity = {
  id: number;
  action: string;
  target: string;
  admin: string;
  /** ISO 8601 timestamp */
  when: string;
  status: string;
};
