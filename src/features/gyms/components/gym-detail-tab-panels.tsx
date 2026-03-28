import type { ReactNode } from "react";
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
  IconUsers,
} from "@tabler/icons-react";

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

export type GymDetailTabPanelsProps = {
  gym: Gym;
  locations: GymLocation[];
  subscription: GymSubscription | null;
  planLabel: string;
  /** Aggregates + placeholders for metrics not on API yet */
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

  const demoMembers = [
    {
      id: "1",
      name: "Riley Patel",
      email: "riley@mail.com",
      status: "Active" as const,
      join: "Apr 2024",
      lastIn: "Mar 16, 2026",
    },
    {
      id: "2",
      name: "Morgan Blake",
      email: "morgan@mail.com",
      status: "Inactive" as const,
      join: "May 2024",
      lastIn: "Jan 05, 2026",
    },
  ];

  const demoActivity = [
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

  const demoTrainers = [
    {
      id: "t1",
      name: "Coach Sarah",
      status: "Active" as const,
      sessions: "180",
    },
  ];

  return (
    <>
      <TabsContent value="overview" className="mt-4 space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <SectionTitle>About</SectionTitle>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
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
            <div className="mt-6 grid gap-5">
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
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <div className="flex items-start gap-5">
              <div
                className="flex size-12 items-center justify-center rounded-md"
                style={{ backgroundColor: "#fff8e6", color: "#e6ae06" }}
              >
                <IconUsers className="size-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total members
                </p>
                <p className="text-3xl font-bold tabular-nums">
                  {metrics.totalMembers}
                </p>
              </div>
            </div>
          </Card>
          <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
            <div className="flex items-start gap-5">
              <div
                className="flex size-12 items-center justify-center rounded-md"
                style={{ backgroundColor: "#ecfdf3", color: "#22c55e" }}
              >
                <IconCircleCheckFilled className="size-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Active members
                </p>
                <p className="text-3xl font-bold tabular-nums text-emerald-600">
                  {metrics.activeMembers}
                </p>
              </div>
            </div>
          </Card>
        </div>
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-[#F4F4F4] text-left text-muted-foreground">
                  <th className="pb-3 pr-4 text-xs font-medium uppercase">
                    Name
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase">
                    Email
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase">
                    Status
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase">
                    Join date
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase">
                    Last check-in
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoMembers.map((row) => {
                  const active = row.status === "Active";
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-[#F4F4F4] last:border-0"
                    >
                      <td className="py-4 pr-4 align-middle font-medium">
                        {row.name}
                      </td>
                      <td className="text-muted-foreground py-4 pr-4 align-middle">
                        {row.email}
                      </td>
                      <td className="py-4 pr-4 align-middle">
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1.5 font-normal capitalize",
                            active &&
                              "border-emerald-200 bg-emerald-50 text-emerald-800",
                            !active && "text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              active ? "bg-emerald-600" : "bg-muted-foreground",
                            )}
                          />
                          {row.status}
                        </Badge>
                      </td>
                      <td className="py-4 pr-4 align-middle">{row.join}</td>
                      <td className="py-4 align-middle">{row.lastIn}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-[#F4F4F4] text-left text-muted-foreground">
                  <th className="pb-3 pr-4 text-xs font-medium uppercase">
                    Date
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase">
                    Action
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase">
                    Performed by
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoActivity.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#F4F4F4] last:border-0"
                  >
                    <td className="text-muted-foreground py-4 pr-4 align-middle">
                      {row.date}
                    </td>
                    <td className="py-4 pr-4 align-middle font-semibold">
                      {row.action}
                    </td>
                    <td className="py-4 pr-4 align-middle">{row.by}</td>
                    <td className="text-muted-foreground py-4 align-middle">
                      {row.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="subscription" className="mt-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionTitle>Current subscription</SectionTitle>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Plan
                </p>
                <p className="mt-1 text-2xl font-bold">{planLabel}</p>
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
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-[#F4F4F4] text-left text-muted-foreground">
                  <th className="pb-3 pr-4 text-xs font-medium uppercase">
                    Trainer
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase">
                    Status
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase">
                    Sessions completed
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoTrainers.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#F4F4F4] last:border-0"
                  >
                    <td className="py-4 pr-4 align-middle font-semibold">
                      {row.name}
                    </td>
                    <td className="py-4 pr-4 align-middle">
                      <Badge
                        variant="outline"
                        className="gap-1.5 border-emerald-200 bg-emerald-50 font-normal text-emerald-800"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-600" />
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right align-middle">
                      {row.sessions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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
