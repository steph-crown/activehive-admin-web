import type { ReactNode } from "react";
import { useMemo } from "react";

import { useToast } from "@/hooks/use-toast";
import {
  IconActivity,
  IconBarbell,
  IconBuilding,
  IconCalendar,
  IconCircleCheckFilled,
  IconCreditCard,
  IconCurrencyDollar,
  IconEdit,
  IconExternalLink,
  IconFileText,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUser,
  IconUserFilled,
  IconUsers,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandX,
  IconWorld,
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
import { formatMoneyDisplayAsNgn } from "@/lib/format-ngn";
import type {
  Gym,
  GymLocation,
  GymMembership,
  GymRegistrationStatusRegistration,
  GymSubscription,
  GymTrainer,
} from "../types";

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

type RegistrationDocuments =
  GymRegistrationStatusRegistration["documents"];

function isProbablyUrl(value: string): boolean {
  const v = value.trim();
  return /^https?:\/\//i.test(v) || v.startsWith("/");
}

function DocumentValue({
  label,
  value,
  preferLink = false,
}: {
  label: string;
  value: string | null | undefined;
  preferLink?: boolean;
}) {
  const raw = value?.trim();
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {!raw ? (
        <p className="text-sm text-foreground">—</p>
      ) : preferLink || isProbablyUrl(raw) ? (
        <a
          href={raw}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          <IconExternalLink className="size-4 shrink-0" aria-hidden />
          Open document
        </a>
      ) : (
        <p className="text-sm font-medium text-foreground break-words">{raw}</p>
      )}
    </div>
  );
}

function RegistrationDocumentsSection({
  documents,
}: {
  documents: RegistrationDocuments;
}) {
  const { showInfo } = useToast();

  if (!documents) {
    return (
      <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
        <SectionTitle>Compliance documents</SectionTitle>
        <p className="text-muted-foreground mt-3 text-sm">
          No registration document payload was returned for this gym.
        </p>
      </Card>
    );
  }

  const additional = documents.additionalDocuments?.filter(Boolean) ?? [];
  const rc = documents.rcValidation;

  return (
    <div className="space-y-4">
      <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
        <SectionTitle>Registration & IDs</SectionTitle>
        <p className="text-muted-foreground mt-1 text-sm">
          Submitted during gym owner onboarding (step 3 · compliance).
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <DocumentValue
            label="Company registration no. (RC)"
            value={documents.companyRegNo ?? undefined}
          />
          <DocumentValue label="RC number" value={documents.rcNumber ?? undefined} />
          <DocumentValue
            label="Government ID type"
            value={documents.governmentIdType ?? undefined}
          />
          <DocumentValue
            label="Government-issued ID"
            value={documents.governmentId ?? undefined}
            preferLink
          />
        </div>
      </Card>

      <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
        <SectionTitle>Address proof</SectionTitle>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <DocumentValue
            label="Date on address proof"
            value={
              documents.addressProofDate
                ? formatDate(documents.addressProofDate)
                : undefined
            }
          />
          <DocumentValue
            label="Address proof file"
            value={documents.addressProof ?? undefined}
            preferLink
          />
        </div>
      </Card>

      <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
        <SectionTitle>RC validation</SectionTitle>
        <p className="text-muted-foreground mt-1 text-sm">
          Run a compliance check against the submitted company / RC details. API
          wiring is not live yet.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() =>
              showInfo(
                "Coming soon",
                "RC validation from the admin dashboard is not available yet.",
              )
            }
          >
            Validate RC
          </Button>
          {rc?.verified != null && (
            <Badge
              variant="outline"
              className={
                rc.verified
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : ""
              }
            >
              {rc.verified ? "Verified" : "Not verified"}
            </Badge>
          )}
          {rc?.proofUrl?.trim() && (
            <a
              href={rc.proofUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              <IconExternalLink className="size-4" />
              Validation proof
            </a>
          )}
        </div>
      </Card>

      {additional.length > 0 && (
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <SectionTitle>Additional documents</SectionTitle>
          <ul className="mt-4 space-y-3">
            {additional.map((url, i) => (
              <li key={`${url}-${i}`}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                >
                  <IconFileText className="size-4 shrink-0" aria-hidden />
                  Document {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

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
  registrationDocuments: RegistrationDocuments;
  memberships: GymMembership[];
  trainers: GymTrainer[];
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
  registrationDocuments,
  memberships,
  trainers,
  metrics,
}: GymDetailTabPanelsProps) {
  const aboutText = gym.description?.trim() || null;

  const ownerName = gym.owner
    ? `${gym.owner.firstName} ${gym.owner.lastName}`.trim()
    : "—";
  const ownerEmail = gym.owner?.email ?? gym.email ?? "—";
  const ownerPhone =
    gym.phoneNumber ??
    (gym.owner?.phoneNumber ? String(gym.owner.phoneNumber) : null) ??
    "—";
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
      : "—";

  const monthlyPriceDisplay =
    subscription?.monthlyPrice && String(subscription.monthlyPrice).trim()
      ? formatMoneyDisplayAsNgn(subscription.monthlyPrice)
      : "—";

  const memberColumns = useMemo<ColumnDef<GymMembership>[]>(
    () => [
      {
        accessorKey: "member",
        header: "Name",
        cell: ({ row }) => {
          const m = row.original.member;
          const name = m
            ? `${m.firstName} ${m.lastName}`.trim() || "—"
            : "—";
          return <div className="font-medium">{name}</div>;
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="text-muted-foreground text-sm">
            {row.original.member?.email ?? "—"}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const active =
            row.original.status?.toLowerCase() === "active";
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
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <span className="capitalize">{row.original.type || "—"}</span>
        ),
      },
      {
        accessorKey: "startDate",
        header: "Start date",
        cell: ({ row }) =>
          row.original.startDate ? formatDate(row.original.startDate) : "—",
      },
      {
        accessorKey: "endDate",
        header: "End date",
        cell: ({ row }) =>
          row.original.endDate ? formatDate(row.original.endDate) : "—",
      },
    ],
    [],
  );

  const trainerColumns = useMemo<ColumnDef<GymTrainer>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Trainer",
        cell: ({ row }) => (
          <span className="font-semibold">
            {row.original.firstName} {row.original.lastName}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const active = row.original.status?.toLowerCase() === "active";
          return (
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
              {row.original.status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "specialties",
        header: "Specialties",
        cell: ({ row }) => {
          const specs = row.original.specialties;
          return (
            <span className="text-muted-foreground text-sm">
              {specs && specs.length > 0 ? specs.join(", ") : "—"}
            </span>
          );
        },
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
            {aboutText ? (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {aboutText}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No description provided.
              </p>
            )}
            {locations.length > 0 && (
              <p className="text-muted-foreground mt-4 text-xs">
                {locations.length} location{locations.length !== 1 ? "s" : ""}{" "}
                on file
              </p>
            )}
            {(gym.website || gym.socialLinks) && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {gym.website?.trim() && (
                  <a
                    href={gym.website.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                  >
                    <IconWorld className="size-4 shrink-0" />
                    Website
                  </a>
                )}
                {gym.socialLinks?.instagram?.trim() && (
                  <a
                    href={gym.socialLinks.instagram.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                  >
                    <IconBrandInstagram className="size-4 shrink-0" />
                    Instagram
                  </a>
                )}
                {gym.socialLinks?.facebook?.trim() && (
                  <a
                    href={gym.socialLinks.facebook.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                  >
                    <IconBrandFacebook className="size-4 shrink-0" />
                    Facebook
                  </a>
                )}
                {gym.socialLinks?.twitterX?.trim() && (
                  <a
                    href={gym.socialLinks.twitterX.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                  >
                    <IconBrandX className="size-4 shrink-0" />
                    X
                  </a>
                )}
              </div>
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

      <TabsContent value="documents" className="mt-4">
        <RegistrationDocumentsSection documents={registrationDocuments} />
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
            bottomSlot={
              <span
                className="text-xs font-medium"
                style={{ color: "var(--grey-500)" }}
              >
                {metrics.activeMembers} active members
              </span>
            }
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
        <DataTable
          data={memberships}
          columns={memberColumns}
          enableDrag={false}
          enableSelection={false}
          getRowId={(row) => row.id}
          emptyMessage="No members to show."
        />
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <Card className="rounded-md border-[#F4F4F4] bg-white p-6 shadow-none">
          <p className="text-muted-foreground text-sm">
            Activity log is not available yet.
          </p>
        </Card>
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
                  Monthly price
                </p>
                <p className="mt-1 text-sm font-medium">{monthlyPriceDisplay}</p>
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
        <DataTable
          data={trainers}
          columns={trainerColumns}
          enableDrag={false}
          enableSelection={false}
          getRowId={(row) => row.id}
          emptyMessage="No trainers to show."
        />
      </TabsContent>
    </>
  );
}

export const GYM_DETAIL_TAB_ITEMS = [
  { value: "overview", label: "Overview", icon: IconBuilding },
  { value: "documents", label: "Documents", icon: IconFileText },
  { value: "members", label: "Members", icon: IconUsers },
  { value: "activity", label: "Activity log", icon: IconActivity },
  { value: "subscription", label: "Subscription", icon: IconCreditCard },
  { value: "trainers", label: "Trainers", icon: IconBarbell },
] as const;
