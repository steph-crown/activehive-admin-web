import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TableCardSkeleton({
  rows = 8,
  columns = 6,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[#F4F4F4] bg-white",
        className,
      )}
    >
      <div className="flex gap-3 border-b border-[#F4F4F4] bg-muted/40 px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-4 flex-1", i === 0 && "max-w-[180px]")}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-3 border-b border-[#F4F4F4] px-4 py-4 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageHeadingSkeleton({
  showSubtitle = false,
  actionCount = 1,
}: {
  showSubtitle?: boolean;
  actionCount?: number;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        {showSubtitle ? (
          <Skeleton className="h-4 w-72 max-w-full" />
        ) : null}
      </div>
      {actionCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: actionCount }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function TablePageSkeleton({
  showAction = true,
  rows = 8,
  columns = 6,
}: {
  showAction?: boolean;
  rows?: number;
  columns?: number;
}) {
  return (
    <>
      <PageHeadingSkeleton
        showSubtitle={false}
        actionCount={showAction ? 1 : 0}
      />
      <TableCardSkeleton rows={rows} columns={columns} />
    </>
  );
}

export function CardFieldsSkeleton({
  fields = 8,
  className,
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#F4F4F4] bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div className="space-y-1 pb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56 max-w-full" />
      </div>
      <div className="grid gap-4 border-t border-[#F4F4F4] pt-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="grid gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <>
      <PageHeadingSkeleton showSubtitle actionCount={2} />
      <CardFieldsSkeleton fields={9} />
    </>
  );
}

export function DetailHeaderToolbarSkeleton({
  actionSlots = 1,
}: {
  actionSlots?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-8 w-40" />
      {actionSlots > 0 ? (
        <div className="flex gap-2">
          {Array.from({ length: actionSlots }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28" />
          ))}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export function DetailTitleBadgeSkeleton() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-48 max-w-full" />
      </div>
      <Skeleton className="h-6 w-24 shrink-0 rounded-full" />
    </div>
  );
}

export function StackedDetailSkeleton({
  toolbar,
  titleBadge,
  cardCount = 2,
  cardFields = 6,
}: {
  toolbar?: boolean;
  titleBadge?: boolean;
  cardCount?: number;
  cardFields?: number;
}) {
  return (
    <div className="space-y-6">
      {toolbar ? <DetailHeaderToolbarSkeleton /> : null}
      {titleBadge ? <DetailTitleBadgeSkeleton /> : null}
      {Array.from({ length: cardCount }).map((_, i) => (
        <CardFieldsSkeleton key={i} fields={cardFields} />
      ))}
    </div>
  );
}

/** Matches gym detail: header + 4 KPI tiles + tab bar + overview-style panels. */
export function GymDetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Skeleton className="mt-0.5 size-10 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-9 w-[min(100%,14rem)]" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-[min(100%,20rem)]" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-md border border-[#F4F4F4] bg-white p-5 shadow-none"
          >
            <div className="flex flex-col items-start gap-5">
              <Skeleton className="size-12 rounded-md" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-9 w-16" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full space-y-4">
        <div className="bg-muted flex h-auto min-h-9 w-full flex-wrap justify-start gap-1 rounded-lg p-[3px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 min-w-[5.5rem] flex-1 rounded-md sm:flex-none sm:min-w-[6.5rem]"
            />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-[#F4F4F4] bg-white p-6 shadow-none">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full max-w-md" />
          </div>
          <div className="rounded-md border border-[#F4F4F4] bg-white p-6 shadow-none">
            <Skeleton className="h-6 w-36" />
            <div className="mt-5 space-y-5">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex gap-3">
                  <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full max-w-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-md border border-[#F4F4F4] bg-white p-6 shadow-none">
          <Skeleton className="h-6 w-40" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, k) => (
              <div key={k} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApplicationReviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[min(100%,22rem)]" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
      <div className="rounded-lg border border-[#F4F4F4] bg-muted/30 px-4 py-3">
        <div className="flex flex-wrap gap-6">
          <Skeleton className="h-14 w-28" />
          <Skeleton className="h-14 w-28" />
        </div>
      </div>
      <CardFieldsSkeleton fields={6} />
      <CardFieldsSkeleton fields={5} />
      <CardFieldsSkeleton fields={4} />
    </div>
  );
}
