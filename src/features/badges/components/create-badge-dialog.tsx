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
import type { BadgeCategory, CreateBadgePayload } from "../types";

const badgeSchema = yup.object({
  name: yup.string().required("Name is required"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
  description: yup.string().nullable(),
  category: yup
    .mixed<BadgeCategory>()
    .oneOf(["streak", "milestone", "social", "achievement"])
    .required(),
  points: yup
    .number()
    .typeError("Points must be a number")
    .required("Points is required")
    .min(0, "Points cannot be negative"),
  criteria: yup.string().nullable(),
});

type FormValues = yup.InferType<typeof badgeSchema>;

const defaultValues: FormValues = {
  name: "",
  slug: "",
  description: "",
  category: "milestone",
  points: 0,
  criteria: "",
};

type CreateBadgeDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCreate: (payload: CreateBadgePayload) => void;
};

function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CreateBadgeDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateBadgeDialogProps) {
  const form = useForm<FormValues>({
    resolver: yupResolver(badgeSchema) as any,
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens only
  }, [open]);

  const onSubmit = (values: FormValues) => {
    onCreate({
      name: values.name,
      slug: values.slug,
      description: values.description?.trim() ? values.description : null,
      category: values.category,
      points: values.points,
      criteria: values.criteria?.trim() ? values.criteria : null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-wide uppercase">
            Create badge
          </DialogTitle>
          <DialogDescription>
            Define a platform badge members and gyms can earn.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="min-w-0 sm:col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Early Bird"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          const slug = form.getValues("slug");
                          if (!slug.trim()) {
                            form.setValue("slug", slugifyName(e.target.value), {
                              shouldValidate: true,
                            });
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
                      <Input placeholder="early-bird" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(v) =>
                          field.onChange(v as BadgeCategory)
                        }
                      >
                        <SelectTrigger className="h-10 w-full min-w-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="streak">Streak</SelectItem>
                          <SelectItem value="milestone">Milestone</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="achievement">
                            Achievement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
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
                      placeholder="What members do to earn this badge."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criteria (internal)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Rules used for automation or review."
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
              <Button type="submit">Create badge</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
