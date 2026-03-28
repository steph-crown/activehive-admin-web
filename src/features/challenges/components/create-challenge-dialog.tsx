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
import type { ChallengeType, CreateChallengePayload } from "../types";

const CHALLENGE_TYPES: ChallengeType[] = [
  "workout_streak",
  "check_in",
  "steps",
  "referral",
];

const challengeSchema = yup.object({
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

type FormValues = yup.InferType<typeof challengeSchema>;

const defaultValues: FormValues = {
  name: "",
  slug: "",
  description: "",
  type: "workout_streak",
  startsAt: "",
  endsAt: "",
  rewardPoints: 0,
};

type CreateChallengeDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCreate: (payload: CreateChallengePayload) => void;
};

function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function dateInputToRangeIso(startsAt: string, endsAt: string): {
  startsAt: string;
  endsAt: string;
} {
  return {
    startsAt: new Date(`${startsAt}T00:00:00.000Z`).toISOString(),
    endsAt: new Date(`${endsAt}T23:59:59.999Z`).toISOString(),
  };
}

export function CreateChallengeDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateChallengeDialogProps) {
  const form = useForm<FormValues>({
    resolver: yupResolver(challengeSchema) as any,
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens only
  }, [open]);

  const onSubmit = (values: FormValues) => {
    const range = dateInputToRangeIso(values.startsAt, values.endsAt);
    onCreate({
      name: values.name,
      slug: values.slug,
      description: values.description?.trim() ? values.description : null,
      type: values.type,
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
            Create challenge
          </DialogTitle>
          <DialogDescription>
            Schedule a timed challenge with a reward for members and gyms.
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
                  <FormItem className="min-w-0 sm:col-span-2">
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
              <Button type="submit">Create challenge</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
