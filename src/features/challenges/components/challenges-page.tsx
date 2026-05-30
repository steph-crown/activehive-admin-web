import { useMemo, useState } from "react";

import {
  TableFilterBar,
  TableFilterSelect,
} from "@/components/molecules/table-filter-bar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TableCardSkeleton } from "@/components/loader/page-skeleton";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { useToast } from "@/hooks/use-toast";
import { IconPlus } from "@tabler/icons-react";
import type {
  CreateChallengePayload,
  PlatformChallenge,
  UpdateChallengePayload,
} from "../types";
import {
  useChallengesQuery,
  useCreateChallengeMutation,
  useDeleteChallengeMutation,
  useUpdateChallengeMutation,
} from "../services";
import type { ChallengesListParams } from "../services/api";
import { ChallengesTable } from "./challenges-table";
import { ConfirmDeleteChallengeDialog } from "./confirm-delete-challenge-dialog";
import { CreateChallengeDialog } from "./create-challenge-dialog";
import { EditChallengeDialog } from "./edit-challenge-dialog";

const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "fitness", label: "Fitness" },
  { value: "weight_loss", label: "Weight loss" },
  { value: "attendance", label: "Attendance" },
  { value: "steps", label: "Steps" },
  { value: "custom", label: "Custom" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "archived", label: "Archived" },
];

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function ChallengesPage() {
  const { showSuccess, showError } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editChallenge, setEditChallenge] = useState<PlatformChallenge | null>(
    null,
  );
  const [deleteChallenge, setDeleteChallenge] =
    useState<PlatformChallenge | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const apiParams = useMemo<ChallengesListParams>(() => {
    const params: ChallengesListParams = { page, limit };
    if (searchQuery) params.search = searchQuery;
    if (typeFilter !== "all") params.type = typeFilter;
    if (statusFilter !== "all") params.status = statusFilter;
    if (dateFilter) {
      params.dateFrom = dateFilter;
      params.dateTo = dateFilter;
    }
    return params;
  }, [page, limit, searchQuery, typeFilter, statusFilter, dateFilter]);

  const { data: response, isLoading, error } = useChallengesQuery(apiParams);
  const createMutation = useCreateChallengeMutation();
  const updateMutation = useUpdateChallengeMutation();
  const deleteMutation = useDeleteChallengeMutation();

  const challenges = response?.data ?? [];
  const pageCount = response?.pagination.totalPages;

  const handleCreate = (payload: CreateChallengePayload) => {
    createMutation.mutate(payload, {
      onSuccess: (created) => {
        setCreateOpen(false);
        showSuccess("Challenge created", `${created.name} was saved.`);
      },
      onError: (err) => {
        showError(
          "Could not create challenge",
          getErrorMessage(err, "Please try again."),
        );
      },
    });
  };

  const handleEditSave = (payload: UpdateChallengePayload) => {
    updateMutation.mutate(payload, {
      onSuccess: (updated) => {
        setEditChallenge(null);
        showSuccess("Challenge updated", `${updated.name} was saved.`);
      },
      onError: (err) => {
        showError(
          "Could not update challenge",
          getErrorMessage(err, "Please try again."),
        );
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteChallenge) return;
    const { id, name } = deleteChallenge;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showSuccess("Challenge deleted", `${name} was removed.`);
        setDeleteChallenge(null);
      },
      onError: (err) => {
        showError(
          "Could not delete challenge",
          getErrorMessage(err, "Please try again."),
        );
      },
    });
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
                <EditChallengeDialog
                  challenge={editChallenge}
                  open={editChallenge != null}
                  onOpenChange={(open) => {
                    if (!open) setEditChallenge(null);
                  }}
                  onSave={handleEditSave}
                />
                <ConfirmDeleteChallengeDialog
                  challenge={deleteChallenge}
                  open={deleteChallenge != null}
                  onOpenChange={(open) => {
                    if (!open) setDeleteChallenge(null);
                  }}
                  onConfirm={handleDeleteConfirm}
                />

                {isLoading ? (
                  <TableCardSkeleton rows={8} columns={8} />
                ) : error ? (
                  <div className="text-destructive">
                    Error loading challenges. Check console for details.
                  </div>
                ) : (
                  <>
                    <TableFilterBar
                      searchValue={searchQuery}
                      onSearchChange={(value) => {
                        setSearchQuery(value);
                        setPage(1);
                      }}
                      searchPlaceholder="Search challenges..."
                      dateValue={dateFilter}
                      onDateChange={(value) => {
                        setDateFilter(value);
                        setPage(1);
                      }}
                      extraFilters={
                        <>
                          <TableFilterSelect
                            value={typeFilter}
                            onValueChange={(value) => {
                              setTypeFilter(value);
                              setPage(1);
                            }}
                            placeholder="Type"
                            options={TYPE_FILTER_OPTIONS}
                            aria-label="Filter by challenge type"
                          />
                          <TableFilterSelect
                            value={statusFilter}
                            onValueChange={(value) => {
                              setStatusFilter(value);
                              setPage(1);
                            }}
                            placeholder="Status"
                            options={STATUS_FILTER_OPTIONS}
                            aria-label="Filter by challenge status"
                          />
                        </>
                      }
                    />

                    <div className="mt-4">
                      <ChallengesTable
                        data={challenges}
                        onEditChallenge={(c) => setEditChallenge(c)}
                        onDeleteChallenge={(c) => setDeleteChallenge(c)}
                        pageIndex={page - 1}
                        pageCount={pageCount}
                        onPageChange={(pageIndex, pageSize) => {
                          setPage(pageIndex + 1);
                          setLimit(pageSize);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
