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
import { DEMO_BADGES } from "../data/demo-badges";
import type { CreateBadgePayload, PlatformBadge } from "../types";
import { BadgesTable } from "./badges-table";
import { CreateBadgeDialog } from "./create-badge-dialog";

const CATEGORY_FILTER_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "streak", label: "Streak" },
  { value: "milestone", label: "Milestone" },
  { value: "social", label: "Social" },
  { value: "achievement", label: "Achievement" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function BadgesPage() {
  const { showSuccess } = useToast();
  const [badges, setBadges] = useState<PlatformBadge[]>(() => [...DEMO_BADGES]);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBadges = useMemo(() => {
    return badges.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      if (categoryFilter !== "all" && row.category !== categoryFilter) {
        return false;
      }
      if (statusFilter !== "all" && row.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [badges, searchQuery, dateFilter, categoryFilter, statusFilter]);

  const handleCreate = (payload: CreateBadgePayload) => {
    const newBadge: PlatformBadge = {
      id: crypto.randomUUID(),
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      criteria: payload.criteria,
      category: payload.category,
      points: payload.points,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setBadges((prev) => [newBadge, ...prev]);
    showSuccess("Badge created", `${payload.name} was added to the catalog.`);
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
                    <h1 className="text-3xl font-bold">Badges</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Define loyalty and achievement badges members can earn
                      across the platform.
                    </p>
                  </div>
                  <Button onClick={() => setCreateOpen(true)}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create badge
                  </Button>
                </div>

                <CreateBadgeDialog
                  open={createOpen}
                  onOpenChange={setCreateOpen}
                  onCreate={handleCreate}
                />

                <TableFilterBar
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchPlaceholder="Search badges..."
                  dateValue={dateFilter}
                  onDateChange={setDateFilter}
                  extraFilters={
                    <>
                      <TableFilterSelect
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                        placeholder="Category"
                        options={CATEGORY_FILTER_OPTIONS}
                        aria-label="Filter by badge category"
                      />
                      <TableFilterSelect
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                        placeholder="Status"
                        options={STATUS_FILTER_OPTIONS}
                        aria-label="Filter by badge status"
                      />
                    </>
                  }
                />

                <div className="mt-4">
                  <BadgesTable data={filteredBadges} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
