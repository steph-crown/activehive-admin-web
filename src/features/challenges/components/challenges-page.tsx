import { useMemo, useState } from "react";

import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useToast } from "@/hooks/use-toast";
import { rowMatchesDateField, rowMatchesSearch } from "@/lib/table-filters";
import { IconPlus } from "@tabler/icons-react";
import { DEMO_CHALLENGES } from "../data/demo-challenges";
import type { CreateChallengePayload, PlatformChallenge } from "../types";
import { ChallengesTable } from "./challenges-table";
import { CreateChallengeDialog } from "./create-challenge-dialog";

const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "workout_streak", label: "Workout streak" },
  { value: "check_in", label: "Check-in" },
  { value: "steps", label: "Steps" },
  { value: "referral", label: "Referral" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function ChallengesPage() {
  const { showSuccess } = useToast();
  const [challenges, setChallenges] = useState<PlatformChallenge[]>(() => [
    ...DEMO_CHALLENGES,
  ]);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return challenges.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.startsAt, dateFilter)) return false;
      if (typeFilter !== "all" && row.type !== typeFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [challenges, searchQuery, dateFilter, typeFilter, statusFilter]);

  const handleCreate = (payload: CreateChallengePayload) => {
    const next: PlatformChallenge = {
      id: crypto.randomUUID(),
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      type: payload.type,
      status: "draft",
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      rewardPoints: payload.rewardPoints,
      participantCount: 0,
      createdAt: new Date().toISOString(),
    };
    setChallenges((prev) => [next, ...prev]);
    showSuccess(
      "Challenge created",
      `${payload.name} was saved as a draft.`,
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="space-y-4 px-4 lg:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">Challenges</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                      View and manage platform challenges across gyms.
                    </p>
                  </div>
                  <Button onClick={() => setCreateOpen(true)}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create challenge
                  </Button>
                </div>

                <CreateChallengeDialog
                  open={createOpen}
                  onOpenChange={setCreateOpen}
                  onCreate={handleCreate}
                />

                <TableFilterBar
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchPlaceholder="Search challenges..."
                  dateValue={dateFilter}
                  onDateChange={setDateFilter}
                  extraFilters={
                    <>
                      <TableFilterSelect
                        value={typeFilter}
                        onValueChange={setTypeFilter}
                        placeholder="Type"
                        options={TYPE_FILTER_OPTIONS}
                        aria-label="Filter by challenge type"
                      />
                      <TableFilterSelect
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                        placeholder="Status"
                        options={STATUS_FILTER_OPTIONS}
                        aria-label="Filter by challenge status"
                      />
                    </>
                  }
                />

                <div className="mt-4">
                  <ChallengesTable data={filtered} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
