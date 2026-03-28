/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  dateInputToRangeIso,
  isoToDateInput,
  slugifyName,
} from "../lib/challenge-form-utils";
import type {
  ChallengeStatus,
  ChallengeType,
  PlatformChallenge,
  UpdateChallengePayload,
} from "../types";

const CHALLENGE_TYPES: ChallengeType[] = [
  "workout_streak",
  "check_in",
  "steps",
  "referral",
];

const CHALLENGE_STATUSES: ChallengeStatus[] = [
  "draft",
  "scheduled",
  "active",
  "completed",
  "cancelled",
];

const editChallengeSchema = yup.object({
  name: yup.string().required("Name is required"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
  description: yup.string().nullable(),
  type: yup
    .mixed<ChallengeType>()
    .oneOf(CHALLENGE_TYPES)
    .required("Type is required"),
  status: yup
    .mixed<ChallengeStatus>()
    .oneOf(CHALLENGE_STATUSES)
    .required("Status is required"),
  startsAt: yup.string().required("Start date is required"),
  endsAt: yup
    .string()
    .required("End date is required")
    .test(
      "after-start",
      "End date must be on or after start date",
      function (endsAt) {
        const { startsAt } = this.parent as { startsAt?: string };
        if (!startsAt || !endsAt) return true;
        return endsAt >= startsAt;
      },
    ),
  rewardPoints: yup
    .number()
    .typeError("Reward must be a number")
    .required("Reward is required")
    .min(0, "Reward cannot be negative"),
});

type FormValues = yup.InferType<typeof editChallengeSchema>;

const emptyEditValues: FormValues = {
  name: "",
  slug: "",
  description: "",
  type: "workout_streak",
  status: "draft",
  startsAt: "",
  endsAt: "",
  rewardPoints: 0,
};

type EditChallengeDialogProps = {
  readonly challenge: PlatformChallenge | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (payload: UpdateChallengePayload) => void;
};

function toFormValues(c: PlatformChallenge): FormValues {
  return {
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    type: c.type,
    status: c.status,
    startsAt: isoToDateInput(c.startsAt),
    endsAt: isoToDateInput(c.endsAt),
    rewardPoints: c.rewardPoints,
  };
}

const statusLabel: Record<ChallengeStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function EditChallengeDialog({
  challenge,
  open,
  onOpenChange,
  onSave,
}: EditChallengeDialogProps) {
  const form = useForm<FormValues>({
    resolver: yupResolver(editChallengeSchema) as any,
    defaultValues: emptyEditValues,
  });

  useEffect(() => {
    if (open && challenge) {
      form.reset(toFormValues(challenge));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens or row changes
  }, [open, challenge?.id]);

  const onSubmit = (values: FormValues) => {
    if (!challenge) return;
    const range = dateInputToRangeIso(values.startsAt, values.endsAt);
    onSave({
      id: challenge.id,
      name: values.name,
      slug: values.slug,
      description: values.description?.trim() ? values.description : null,
      type: values.type,
      status: values.status,
      startsAt: range.startsAt,
      endsAt: range.endsAt,
      rewardPoints: values.rewardPoints,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-wide uppercase">
            Edit challenge
          </DialogTitle>
          <DialogDescription>
            Update schedule, reward, and visibility for this challenge.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="min-w-0 sm:col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="March movement"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          const slug = form.getValues("slug");
                          if (!slug.trim()) {
                            form.setValue(
                              "slug",
                              slugifyName(e.target.value),
                              { shouldValidate: true },
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="min-w-0 sm:col-span-2">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="march-movement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(v) =>
                          field.onChange(v as ChallengeType)
                        }
                      >
                        <SelectTrigger className="h-10 w-full min-w-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="workout_streak">
                            Workout streak
                          </SelectItem>
                          <SelectItem value="check_in">Check-in</SelectItem>
                          <SelectItem value="steps">Steps</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(v) =>
                          field.onChange(v as ChallengeStatus)
                        }
                      >
                        <SelectTrigger className="h-10 w-full min-w-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CHALLENGE_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {statusLabel[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
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
                      <Input type="date" {...field} />
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
                      <Input type="date" {...field} />
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
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
