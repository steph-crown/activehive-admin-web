export type LeaderboardScope = "platform" | "gym";

export type LeaderboardPeriod = "weekly" | "monthly" | "all_time";

export type LeaderboardMetric = "points" | "visits" | "classes";

export type LeaderboardStatus = "live" | "draft" | "archived";

export type PlatformLeaderboard = {
  id: string;
  name: string;
  description: string | null;
  scope: LeaderboardScope;
  metric: LeaderboardMetric;
  period: LeaderboardPeriod;
  status: LeaderboardStatus;
  participantCount: number;
  updatedAt: string;
};
