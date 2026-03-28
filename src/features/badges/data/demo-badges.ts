import type { PlatformBadge } from "../types";

export const DEMO_BADGES: PlatformBadge[] = [
  {
    id: "b1",
    name: "Early Bird",
    slug: "early-bird",
    description: "Complete 10 check-ins before 8am.",
    category: "streak",
    points: 50,
    status: "active",
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "b2",
    name: "Century Club",
    slug: "century-club",
    description: "Log 100 total workouts.",
    category: "milestone",
    points: 200,
    status: "active",
    createdAt: "2026-02-03T14:30:00.000Z",
  },
  {
    id: "b3",
    name: "Community Champion",
    slug: "community-champion",
    description: "Refer 5 members who activate.",
    category: "social",
    points: 150,
    status: "active",
    createdAt: "2026-02-18T09:15:00.000Z",
  },
  {
    id: "b4",
    name: "Legacy",
    slug: "legacy",
    description: "Deprecated trial badge.",
    category: "achievement",
    points: 25,
    status: "inactive",
    createdAt: "2025-11-01T16:00:00.000Z",
  },
];
