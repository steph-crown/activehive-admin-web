import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SectionCardsSkeleton() {
  const cardKeys = ["card-0", "card-1", "card-2", "card-3"] as const;
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardKeys.map((cardKey) => (
        <Card
          key={cardKey}
          className="@container/card !rounded-md gap-0 border border-[#F4F4F4] bg-white p-0 shadow-none"
        >
          <div className="flex flex-col gap-2 p-5">
            <div className="flex flex-col items-start gap-5">
              <Skeleton className="h-12 w-12 rounded-[10px]" />
              <Skeleton className="h-4 w-28" />
            </div>

            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-7 w-24" />

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-3 w-14" />
                </div>
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ChartAreaSkeleton() {
  return (
    <Card className="@container/card !rounded-md">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-44" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
        <CardAction>
          <Skeleton className="h-9 w-40 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-grey-50 p-0 shadow-none">
        <div className="flex flex-col">
          <div className="border-grey-50 flex items-center justify-between border-b px-6 py-3">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-9 w-56 rounded-md" />
          </div>
          <div className="flex flex-col gap-4 p-6">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </Card>

      <Card className="border-grey-50 p-0 shadow-none">
        <div className="flex flex-col">
          <div className="border-grey-50 flex items-center justify-between border-b px-6 py-3">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-9 w-56 rounded-md" />
          </div>
          <div className="flex flex-col gap-4 p-6">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </Card>
    </div>
  );
}

export function DashboardTableSkeleton() {
  const headerKeys = [
    "col-0",
    "col-1",
    "col-2",
    "col-3",
    "col-4",
  ] as const;
  const rowKeys = ["row-0", "row-1", "row-2", "row-3", "row-4", "row-5"] as const;

  return (
    <div className="relative flex flex-col gap-4 overflow-auto">
      <div className="overflow-hidden !rounded-md border border-[#F4F4F4]">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {headerKeys.map((colKey) => (
                <TableHead key={colKey}>
                  <Skeleton className="h-4 w-28" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowKeys.map((rowKey) => (
              <TableRow key={rowKey}>
                {headerKeys.map((colKey) => (
                  <TableCell key={`${rowKey}-${colKey}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-3 px-4 py-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>
    </div>
  );
}

