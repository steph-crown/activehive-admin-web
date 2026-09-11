import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus, X } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUpdateSubscriptionPlanMutation } from "../services";
import type { SubscriptionPlan } from "../types";

const FEATURE_PLACEHOLDERS = [
  "Unlimited member management",
  "Class scheduling",
  "Staff management",
  "Analytics & reports",
  "Mobile app access",
];

const editPlanSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().nullable(),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price cannot be negative"),
  hasTrial: yup.boolean().required(),
  trialDays: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || Number.isNaN(value) ? null : value,
    )
    .min(0, "Trial days cannot be negative")
    .optional(),
  isActive: yup.boolean().required(),
  isPopular: yup.boolean().required(),
  sortOrder: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || Number.isNaN(value) ? null : value,
    )
    .optional(),
  features: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one feature is required")
    .required(),
});

type EditPlanFormValues = yup.InferType<typeof editPlanSchema>;

type EditSubscriptionPlanDialogProps = {
  readonly plan: SubscriptionPlan | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
};

export function EditSubscriptionPlanDialog({
  plan,
  open,
  onOpenChange,
}: EditSubscriptionPlanDialogProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: updatePlan, isPending } =
    useUpdateSubscriptionPlanMutation();

  const form = useForm<EditPlanFormValues>({
    // Cast resolver to avoid overly strict generic mismatch between yup and react-hook-form
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(editPlanSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: "" as unknown as number,
      hasTrial: false,
      trialDays: null,
      isActive: true,
      isPopular: false,
      sortOrder: null,
      features: [""],
    },
  });

  const hasTrial = useWatch({ control: form.control, name: "hasTrial" });
  const features = useWatch({ control: form.control, name: "features" });

  useEffect(() => {
    if (open && plan) {
      const planFeatures = (plan.features ?? []).filter(Boolean);
      form.reset({
        name: plan.name,
        description: plan.description ?? "",
        price: Number(plan.price),
        hasTrial: plan.trialDays != null && plan.trialDays > 0,
        trialDays: plan.trialDays ?? null,
        isActive: plan.isActive,
        isPopular: plan.isPopular,
        sortOrder: plan.sortOrder ?? null,
        features: planFeatures.length > 0 ? planFeatures : [""],
      });
    }
  }, [open, plan, form]);

  const addFeature = () => {
    form.setValue("features", [...(features ?? []), ""]);
  };

  const removeFeature = (index: number) => {
    const current = features ?? [];
    form.setValue(
      "features",
      current.filter((_, i) => i !== index),
    );
  };

  const updateFeature = (index: number, value: string) => {
    const current = [...(features ?? [])];
    current[index] = value;
    form.setValue("features", current);
  };

  const onSubmit = async (values: EditPlanFormValues) => {
    if (!plan) return;

    try {
      await updatePlan({
        id: plan.id,
        payload: {
          name: values.name,
          description: values.description ?? null,
          price: values.price,
          trialDays: values.hasTrial ? (values.trialDays ?? null) : null,
          isActive: values.isActive,
          isPopular: values.isPopular,
          sortOrder: values.sortOrder ?? null,
          features: (values.features ?? []).filter(Boolean),
        },
      });
      showSuccess("Success", "Subscription plan updated successfully");
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update subscription plan. Please try again.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription Plan</DialogTitle>
          <DialogDescription>
            Update pricing and details for this platform plan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Basic Trainer Plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Perfect for freelance trainers starting out."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="29.99"
                        {...field}
                        value={field.value ?? ""}
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
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="1"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hasTrial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Has Trial</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasTrial && (
              <FormField
                control={form.control}
                name="trialDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trial Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="7"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div>
              <FormLabel>Features</FormLabel>
              <div className="mt-2 space-y-2">
                {(features ?? []).map((feat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={
                        FEATURE_PLACEHOLDERS[index % FEATURE_PLACEHOLDERS.length]
                      }
                      value={feat ?? ""}
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    {(features ?? []).length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-destructive hover:text-destructive"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="size-4" />
                        <span className="sr-only">Remove feature</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {form.formState.errors.features && (
                <p className="text-destructive mt-1.5 text-sm">
                  {form.formState.errors.features.message as string}
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 gap-1.5"
                onClick={addFeature}
              >
                <Plus className="size-4" />
                Add feature
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPopular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Popular</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
