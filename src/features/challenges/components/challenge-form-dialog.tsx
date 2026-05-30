/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CHALLENGE_STATUSES,
  CHALLENGE_TYPES,
  challengeStatusLabel,
  createChallengeFormSchema,
  editChallengeFormSchema,
  emptyChallengeFormValues,
  type ChallengeFormValues,
} from "../lib/challenge-form-schema";
import {
  canEditChallenge,
  dateInputToRangeIso,
  isoToDateInput,
  minEndDateInput,
  minFutureDateInput,
} from "../lib/challenge-form-utils";
import { challengeTypeLabel } from "../lib/challenge-display";
import type { ChallengeStatus, ChallengeType, PlatformChallenge } from "../types";

export type ChallengeFormSubmitValues = {
  name: string;
  description: string | null;
  type: ChallengeType;
  startsAt: string;
  endsAt: string;
  rewardPoints: number;
  status?: ChallengeStatus;
};

type ChallengeFormDialogProps = {
  readonly mode: "create" | "edit";
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly challenge?: PlatformChallenge | null;
  readonly isSubmitting?: boolean;
  readonly onSubmit: (values: ChallengeFormSubmitValues) => void;
};

function toFormValues(challenge: PlatformChallenge): ChallengeFormValues {
  return {
    name: challenge.name,
    description: challenge.description ?? "",
    type: challenge.type,
    status: challenge.status,
    startsAt: isoToDateInput(challenge.startsAt),
    endsAt: isoToDateInput(challenge.endsAt),
    rewardPoints: challenge.rewardPoints,
  };
}

export function ChallengeFormDialog({
  mode,
  open,
  onOpenChange,
  challenge,
  isSubmitting = false,
  onSubmit,
}: ChallengeFormDialogProps) {
  const isEdit = mode === "edit";
  const isLockedEdit =
    isEdit && challenge != null && !canEditChallenge(challenge.startsAt);
  const form = useForm<ChallengeFormValues>({
    resolver: yupResolver(
      isEdit ? editChallengeFormSchema : createChallengeFormSchema,
    ) as any,
    defaultValues: emptyChallengeFormValues,
  });
  const startsAtValue = form.watch("startsAt");

  useEffect(() => {
    if (!open) return;
    if (isLockedEdit) {
      onOpenChange(false);
      return;
    }
    if (isEdit && challenge) {
      form.reset(toFormValues(challenge));
      return;
    }
    if (!isEdit) {
      form.reset(emptyChallengeFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens or row changes
  }, [open, isEdit, challenge?.id]);

  const handleSubmit = (values: ChallengeFormValues) => {
    if (isLockedEdit) return;
    const range = dateInputToRangeIso(values.startsAt, values.endsAt);
    onSubmit({
      name: values.name,
      description: values.description?.trim() ? values.description : null,
      type: values.type,
      startsAt: range.startsAt,
      endsAt: range.endsAt,
      rewardPoints: values.rewardPoints as number,
      ...(isEdit ? { status: values.status! } : {}),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-wide uppercase">
            {isEdit ? "Edit challenge" : "Create challenge"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update schedule, reward, and visibility for this challenge."
              : "Schedule a timed challenge with a reward for members and gyms."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="min-w-0 sm:col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="March movement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem
                    className={isEdit ? "min-w-0" : "min-w-0 sm:col-span-2"}
                  >
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as ChallengeType)
                        }
                      >
                        <SelectTrigger className="h-10 w-full min-w-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CHALLENGE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {challengeTypeLabel[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEdit && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(value as ChallengeStatus)
                          }
                        >
                          <SelectTrigger className="h-10 w-full min-w-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CHALLENGE_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {challengeStatusLabel[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="rewardPoints"
                render={({ field }) => (
                  <FormItem className="min-w-0 sm:col-span-2">
                    <FormLabel>Reward (points)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        placeholder="0"
                        {...field}
                        value={field.value === "" ? "" : field.value}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === ""
                              ? ""
                              : Number(event.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={minFutureDateInput()}
                        {...field}
                        onChange={(event) => {
                          field.onChange(event);
                          void form.trigger("endsAt");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>End date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={minEndDateInput(startsAtValue)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What participants need to do to complete the challenge."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {isEdit ? "Save changes" : "Create challenge"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
