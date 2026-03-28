import { useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import {
  rowMatchesDateField,
  rowMatchesSearch,
} from "@/lib/table-filters";
import { useTrainersQuery } from "../services";
import type { Trainer } from "../types";
import { TrainersTable } from "./trainers-table";
import { ViewTrainerDialog } from "./view-trainer-dialog";
import { EditTrainerDialog } from "./edit-trainer-dialog";
import { ConfirmTrainerActionDialog } from "./confirm-trainer-action-dialog";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const ONBOARDING_OPTIONS = [
  { value: "all", label: "All trainers" },
  { value: "complete", label: "Onboarding complete" },
  { value: "pending", label: "Onboarding pending" },
];

export function TrainersPage() {
  const [viewTrainer, setViewTrainer] = useState<Trainer | null>(null);
  const [editTrainer, setEditTrainer] = useState<Trainer | null>(null);
  const [action, setAction] = useState<{
    trainer: Trainer;
    action: "delete" | "activate" | "deactivate";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [onboardingFilter, setOnboardingFilter] = useState("all");

  const { data, isLoading, error } = useTrainersQuery();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (!rowMatchesSearch(row, searchQuery)) return false;
      if (!rowMatchesDateField(row.createdAt, dateFilter)) return false;
      if (statusFilter !== "all") {
        if (row.status?.toLowerCase() !== statusFilter) return false;
      }
      if (onboardingFilter === "complete" && !row.onboardingCompleted) {
        return false;
      }
      if (onboardingFilter === "pending" && row.onboardingCompleted) {
        return false;
      }
      return true;
    });
  }, [data, searchQuery, dateFilter, statusFilter, onboardingFilter]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="mb-4 text-3xl font-bold">Trainers</h1>

                <ViewTrainerDialog
                  trainer={viewTrainer}
                  open={viewTrainer != null}
                  onOpenChange={(open) => !open && setViewTrainer(null)}
                />
                <EditTrainerDialog
                  trainer={editTrainer}
                  open={editTrainer != null}
                  onOpenChange={(open) => !open && setEditTrainer(null)}
                />
                <ConfirmTrainerActionDialog
                  trainer={action?.trainer ?? null}
                  action={action?.action ?? "deactivate"}
                  open={action != null}
                  onOpenChange={(open) => {
                    if (!open) {
                      setAction(null);
                    }
                  }}
                />

                {isLoading ? (
                  <TableCardSkeleton rows={8} columns={6} />
                ) : error ? (
                  <div className="text-destructive">
                    Error loading trainers. Check console for details.
                  </div>
                ) : data ? (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={setSearchQuery}
                      searchPlaceholder="Search trainers..."
                      dateValue={dateFilter}
                      onDateChange={setDateFilter}
                      extraFilters={
                        <>
                          <TableFilterSelect
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                            placeholder="Status"
                            options={STATUS_OPTIONS}
                            aria-label="Filter by status"
                          />
                          <TableFilterSelect
                            value={onboardingFilter}
                            onValueChange={setOnboardingFilter}
                            placeholder="Onboarding"
                            options={ONBOARDING_OPTIONS}
                            aria-label="Filter by onboarding"
                          />
                        </>
                      }
                    />
                    <TrainersTable
                      data={filteredData}
                      onViewTrainer={(trainer) => setViewTrainer(trainer)}
                      onEditTrainer={(trainer) => setEditTrainer(trainer)}
                      onDeleteTrainer={(trainer) =>
                        setAction({ trainer, action: "delete" })
                      }
                      onActivateTrainer={(trainer) =>
                        setAction({ trainer, action: "activate" })
                      }
                      onDeactivateTrainer={(trainer) =>
                        setAction({ trainer, action: "deactivate" })
                      }
                    />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
