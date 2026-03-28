import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  IconActivity,
  IconBarbell,
  IconBuilding,
  IconCalendar,
  IconCircleCheckFilled,
  IconCreditCard,
  IconCurrencyDollar,
  IconEdit,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUser,
  IconUserFilled,
  IconUsers,
} from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import {
  mergeSectionMetricCssVars,
  SectionMetricCard,
} from "@/features/dashboard/components/section-metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { cn, formatDate } from "@/lib/utils";
import type { Gym, GymLocation, GymSubscription } from "../types";

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold text-foreground">{children}</h3>;
}

function LabelRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function formatCityState(gym: Gym): string {
  const a = gym.address;
  if (!a) return "—";
  const city = a.city?.trim();
  const state = a.state?.trim();
  if (city && state) return `${city}, ${state}`;
  return [city, state].filter(Boolean).join(", ") || "—";
}

type DemoMemberRow = {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  join: string;
  lastIn: string;
};

type DemoActivityRow = {
  id: string;
  date: string;
  action: string;
  by: string;
  details: string;
};

type DemoTrainerRow = {
  id: string;
  name: string;
  status: string;
  sessions: string;
};

const METRIC_BASE_VARS = {
  "--success-500": "#22c55e",
  "--error-400": "#dc5959",
  "--grey-500": "#959595",
} as Record<string, string>;

export type GymDetailTabPanelsProps = {
  gym: Gym;
  locations: GymLocation[];
  subscription: GymSubscription | null;
  planLabel: string;
  metrics: {
    totalMembers: number;
    activeMembers: number;
    totalTrainers: number;
    totalClasses: number;
    checkInsToday: number;
    monthlyRevenueDisplay: string;
  };
};

export function GymDetailTabPanels({
  gym,
  locations,
  subscription,
  planLabel,
  metrics,
}: GymDetailTabPanelsProps) {
  const aboutText =
    gym.description?.trim() ||
    "Weightlifting and powerlifting focused gym in West Hollywood.";

  const ownerName = gym.owner
    ? `${gym.owner.firstName} ${gym.owner.lastName}`.trim()
    : "Sarah Lee";
  const ownerEmail = gym.owner?.email ?? gym.email ?? "sarah@iron.com";
  const ownerPhone =
    gym.phoneNumber ?? gym.owner?.phoneNumber?.toString() ?? "+1 310 555 0200";
  const ownerLocation = formatCityState(gym);
  const createdLabel = formatDate(gym.createdAt);

  const billingCycle = subscription?.isTrial
    ? "Trial"
    : subscription?.autoRenew
      ? "Monthly"
      : "Monthly";
  const nextBilling =
    subscription?.nextPaymentDate != null
      ? formatDate(subscription.nextPaymentDate)
      : "Apr 20, 2026";

  const demoMembers: DemoMemberRow[] = [
    {
      id: "1",
      name: "Riley Patel",
      email: "riley@mail.com",
      status: "Active",
      join: "Apr 2024",
      lastIn: "Mar 16, 2026",
    },
    {
      id: "2",
      name: "Morgan Blake",
      email: "morgan@mail.com",
      status: "Inactive",
      join: "May 2024",
      lastIn: "Jan 05, 2026",
    },
  ];

  const demoActivity: DemoActivityRow[] = [
    {
      id: "a1",
      date: "Mar 17, 2026",
      action: "Signup completed",
      by: "Sarah Lee",
      details: "Owner completed registration",
    },
    {
      id: "a2",
      date: "Mar 20, 2024",
      action: "Gym created",
      by: "Admin",
      details: "Invitation sent to sarah@iron.com",
    },
  ];

  const demoTrainers: DemoTrainerRow[] = [
    {
      id: "t1",
      name: "Coach Sarah",
      status: "Active",
      sessions: "180",
    },
  ];

  const memberColumns = useMemo<ColumnDef<DemoMemberRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="text-muted-foreground text-sm">
            {row.original.email}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const active = row.original.status === "Active";
          return (
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 font-normal capitalize",
                active && "border-emerald-200 bg-emerald-50 text-emerald-800",
                !active && "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-emerald-600" : "bg-muted-foreground",
                )}
              />
              {row.original.status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "join",
        header: "Join date",
        cell: ({ row }) => row.original.join,
      },
      {
        accessorKey: "lastIn",
        header: "Last check-in",
        cell: ({ row }) => row.original.lastIn,
      },
    ],
    [],
  );

  const activityColumns = useMemo<ColumnDef<DemoActivityRow>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.date}</span>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.action}</span>
        ),
      },
      {
        accessorKey: "by",
        header: "Performed by",
        cell: ({ row }) => row.original.by,
      },
      {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.details}</span>
        ),
      },
    ],
    [],
  );

  const trainerColumns = useMemo<ColumnDef<DemoTrainerRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Trainer",
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="gap-1.5 border-emerald-200 bg-emerald-50 font-normal text-emerald-800"
          >
            <span className="size-1.5 rounded-full bg-emerald-600" />
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "sessions",
        header: () => (
          <span className="block text-right">Sessions completed</span>
        ),
        cell: ({ row }) => (
          <div className="text-right">{row.original.sessions}</div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <TabsContent value="overview" className="mt-4 space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <SectionTitle>About</SectionTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {aboutText}
            </p>
            {locations.length > 0 && (
              <p className="text-muted-foreground mt-4 text-xs">
                {locations.length} location{locations.length !== 1 ? "s" : ""}{" "}
                on file
              </p>
            )}
          </Card>
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <SectionTitle>Owner details</SectionTitle>
            <div className="grid gap-5">
              <LabelRow
                icon={<IconUser className="size-5" />}
                label="Owner"
                value={ownerName}
              />
              <LabelRow
                icon={<IconMail className="size-5" />}
                label="Email"
                value={ownerEmail}
              />
              <LabelRow
                icon={<IconPhone className="size-5" />}
                label="Phone"
                value={ownerPhone}
              />
              <LabelRow
                icon={<IconMapPin className="size-5" />}
                label="Location"
                value={ownerLocation}
              />
              <LabelRow
                icon={<IconCalendar className="size-5" />}
                label="Created"
                value={createdLabel}
              />
            </div>
          </Card>
        </div>
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionTitle>Subscription</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <LabelRow
              icon={<IconCreditCard className="size-5" />}
              label="Plan"
              value={planLabel}
            />
            <LabelRow
              icon={<IconActivity className="size-5" />}
              label="Billing cycle"
              value={billingCycle}
            />
            <LabelRow
              icon={<IconCalendar className="size-5" />}
              label="Next billing"
              value={nextBilling}
            />
            <LabelRow
              icon={<IconCurrencyDollar className="size-5" />}
              label="Monthly revenue"
              value={metrics.monthlyRevenueDisplay}
            />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="members" className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <SectionMetricCard
            title="Total members"
            value={String(metrics.totalMembers)}
            icon={<IconUserFilled className="size-6" />}
            iconBgVar="var(--purple-50)"
            iconColorVar="var(--purple-500)"
            percentChange={0}
            isPositive
            comparisonText="vs last period"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]"
            style={mergeSectionMetricCssVars({
              ...METRIC_BASE_VARS,
              "--purple-50": "#f2eeff",
              "--purple-500": "#7e52ff",
            })}
          />
          <SectionMetricCard
            title="Active members"
            value={String(metrics.activeMembers)}
            icon={<IconCircleCheckFilled className="size-6" />}
            iconBgVar="var(--success-50)"
            iconColorVar="var(--success-500)"
            percentChange={0}
            isPositive
            comparisonText="vs last period"
            hoverShadowClass="hover:shadow-[0_14px_30px_-20px_rgba(34,197,94,0.22)]"
            style={mergeSectionMetricCssVars({
              ...METRIC_BASE_VARS,
              "--success-50": "#ecfdf3",
              "--success-500": "#22c55e",
            })}
          />
        </div>
        {/* <Card className="rounded-md border-[#F4F4F4] bg-white p-0 shadow-none"> */}
        <DataTable
          data={demoMembers}
          columns={memberColumns}
          enableDrag={false}
          enableSelection={false}
          getRowId={(row) => row.id}
          emptyMessage="No members to show."
        />
        {/* </Card> */}
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        {/* <Card className="rounded-md border-[#F4F4F4] bg-white p-0 shadow-none"> */}
        <DataTable
          data={demoActivity}
          columns={activityColumns}
          enableDrag={false}
          enableSelection={false}
          getRowId={(row) => row.id}
          emptyMessage="No activity yet."
        />
        {/* </Card> */}
      </TabsContent>

      <TabsContent value="subscription" className="mt-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionTitle>Current subscription</SectionTitle>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Plan
                </p>
                <p className="mt-1 text-sm font-bold">{planLabel}</p>
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Billing cycle
                </p>
                <p className="mt-1 text-sm font-medium">{billingCycle}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Next billing date
                </p>
                <p className="mt-1 text-sm font-medium">{nextBilling}</p>
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Usage limits
                </p>
                <p className="mt-1 text-sm font-medium">
                  Up to 200 members, 10 classes
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-[#F4F4F4] pt-6">
            <Button variant="outline" size="sm" className="gap-2">
              <IconEdit className="size-4" />
              Change plan
            </Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="trainers" className="mt-4">
        {/* <Card className="rounded-md border-[#F4F4F4] bg-white p-0 shadow-none"> */}
        <DataTable
          data={demoTrainers}
          columns={trainerColumns}
          enableDrag={false}
          enableSelection={false}
          getRowId={(row) => row.id}
          emptyMessage="No trainers to show."
        />
        {/* </Card> */}
      </TabsContent>
    </>
  );
}

export const GYM_DETAIL_TAB_ITEMS = [
  { value: "overview", label: "Overview", icon: IconBuilding },
  { value: "members", label: "Members", icon: IconUsers },
  { value: "activity", label: "Activity log", icon: IconActivity },
  { value: "subscription", label: "Subscription", icon: IconCreditCard },
  { value: "trainers", label: "Trainers", icon: IconBarbell },
] as const;
