 
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { type ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/data-table/data-table";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import type { SubscriptionPlan } from "../types";
import type { Subscription } from "../types";
import { useRenewSubscriptionMutation } from "../services";

function isExpiredSubscriptionStatus(status: string): boolean {
  return status?.trim().toLowerCase() === "expired";
}

function PlanCell({ plan, fallback }: { plan: SubscriptionPlan | null; fallback: string | null }) {
  const name = plan?.name ?? fallback;
  if (!name) return <span className="text-muted-foreground">—</span>;

  const badge = (
    <Badge variant="outline" className="text-muted-foreground cursor-default px-1.5">
      {name}
    </Badge>
  );

  if (!plan) return badge;

  const price = Number(plan.price);
  const priceStr = Number.isFinite(price) ? `₦${price.toLocaleString()}` : plan.price;
  const period = plan.billingPeriod ?? "";
  const limits = [
    plan.maxStaff != null ? `${plan.maxStaff} staff` : null,
    plan.maxLocations != null ? `${plan.maxLocations} location${plan.maxLocations === 1 ? "" : "s"}` : null,
    plan.maxClassesPerMonth != null ? `${plan.maxClassesPerMonth} classes/mo` : null,
  ].filter(Boolean);

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent
        side="right"
        className="bg-popover text-popover-foreground border shadow-md w-56 space-y-2 rounded-md p-3 text-xs"
      >
        <p className="font-semibold text-sm">{plan.name}</p>
        <p className="text-muted-foreground">
          {priceStr} / {period} · {plan.planType.replace("_", " ")}
        </p>
        {plan.description && (
          <p className="text-muted-foreground line-clamp-2">{plan.description}</p>
        )}
        {limits.length > 0 && (
          <p className="text-muted-foreground">Limits: {limits.join(", ")}</p>
        )}
        {(plan.featureFlags ?? []).length > 0 && (
          <p className="text-muted-foreground">
            Flags: {(plan.featureFlags ?? []).join(", ")}
          </p>
        )}
        {plan.trialDays != null && plan.trialDays > 0 && (
          <p className="text-muted-foreground">{plan.trialDays}-day trial</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

const baseColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "gym",
    header: "Gym",
    cell: ({ row }) => {
      const gym = row.original.gym;
      if (!gym) return <span className="text-muted-foreground">N/A</span>;
      return <div className="font-medium">{gym.name}</div>;
    },
  },
  {
    accessorKey: "gymOwner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.original.gymOwner;
      if (!owner) return <span className="text-muted-foreground">N/A</span>;
      return (
        <div>
          {owner.firstName} {owner.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "platformPlan",
    header: "Plan",
    cell: ({ row }) => (
      <PlanCell plan={row.original.platformPlan} fallback={row.original.plan} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant="outline"
          className="text-muted-foreground px-1.5 capitalize"
        >
          {status === "active" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "monthlyPrice",
    header: "Monthly Price",
    cell: ({ row }) => {
      const price = row.original.monthlyPrice;
      if (price == null || price === "") {
        return <span className="text-muted-foreground">—</span>;
      }
      const num = Number(price);
      return (
        <div className="text-sm">
          {Number.isFinite(num) ? `₦${num.toFixed(2)}` : price}
        </div>
      );
    },
  },
  {
    accessorKey: "trialEndDate",
    header: "Trial Ends",
    cell: ({ row }) => {
      const date = row.original.trialEndDate;
      if (!date) return <span className="text-muted-foreground">N/A</span>;
      return <div className="text-sm">{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "subscriptionEndDate",
    header: "Subscription Ends",
    cell: ({ row }) => {
      const date = row.original.subscriptionEndDate;
      if (!date) return <span className="text-muted-foreground">N/A</span>;
      return <div className="text-sm">{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "autoRenew",
    header: "Auto Renew",
    cell: ({ row }) => (
      <Badge variant={row.original.autoRenew ? "default" : "secondary"}>
        {row.original.autoRenew ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="text-sm">{formatDate(row.original.createdAt)}</div>
      );
    },
  },
];

type SubscriptionsTableProps = {
  data: Subscription[];
  pageIndex?: number;
  pageCount?: number;
  onPageChange?: (pageIndex: number, pageSize: number) => void;
};

export function SubscriptionsTable({
  data,
  pageIndex,
  pageCount,
  onPageChange,
}: SubscriptionsTableProps) {
  const {
    mutate: renew,
    isPending,
    variables: renewingVars,
  } = useRenewSubscriptionMutation();
  const { showSuccess, showError } = useToast();

  const columns = useMemo<ColumnDef<Subscription>[]>(
    () => [
      ...baseColumns,
      {
        id: "actions",
        cell: ({ row }) => {
          const subscription = row.original;
          const canRenew = isExpiredSubscriptionStatus(subscription.status);
          const isRenewingThis = isPending && renewingVars?.subscriptionId === subscription.id;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                  size="icon"
                >
                  <IconDotsVertical />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[11rem]">
                <DropdownMenuItem asChild>
                  <Link to={`/dashboard/subscriptions/${subscription.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                {canRenew ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={isPending}
                      onSelect={() => {
                        renew({ subscriptionId: subscription.id }, {
                          onSuccess: () => {
                            showSuccess(
                              "Subscription renewed",
                              "The subscription was renewed successfully.",
                            );
                          },
                          onError: (error) => {
                            showError("Renewal failed", getApiErrorMessage(error, "Could not renew this subscription."));
                          },
                        });
                      }}
                    >
                      {isRenewingThis ? (
                        <Loader2
                          className="size-4 shrink-0 animate-spin"
                          aria-hidden
                        />
                      ) : null}
                      Renew subscription
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [isPending, renewingVars, renew, showError, showSuccess],
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      enableDrag={false}
      enableSelection={false}
      getRowId={(row) => row.id}
      pageIndex={pageIndex}
      pageCount={pageCount}
      onPageChange={onPageChange}
    />
  );
}
