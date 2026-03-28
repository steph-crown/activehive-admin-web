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
import { useToast } from "@/hooks/use-toast";
import { BILLING_PERIODS, type BillingPeriod } from "../constants";
import { useCreateSubscriptionPlanMutation } from "../services";

const createPlanSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().nullable(),
  planType: yup
    .mixed<"gym_owner" | "trainer">()
    .oneOf(["gym_owner", "trainer"])
    .required("Plan type is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price cannot be negative"),
  billingPeriod: yup.mixed<BillingPeriod>().oneOf(
    BILLING_PERIODS.map((p) => p.value) as BillingPeriod[],
  ),
  trialDays: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || Number.isNaN(value) ? null : value,
    )
    .min(0, "Trial days cannot be negative")
    .optional(),
  hasTrial: yup.boolean().required(),
  isDefault: yup.boolean().required(),
  features: yup.string().nullable(),
});

type CreatePlanFormValues = yup.InferType<typeof createPlanSchema>;

type CreateSubscriptionPlanDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly initialPlanType: "gym_owner" | "trainer";
};

export function CreateSubscriptionPlanDialog({
  open,
  onOpenChange,
  initialPlanType,
}: CreateSubscriptionPlanDialogProps) {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: createPlan, isPending } =
    useCreateSubscriptionPlanMutation();

  const form = useForm<CreatePlanFormValues>({
    resolver: yupResolver(createPlanSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      planType: initialPlanType,
      price: "" as unknown as number,
      billingPeriod: "monthly",
      trialDays: null,
      hasTrial: true,
      isDefault: false,
      features: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        description: "",
        planType: initialPlanType,
        price: "" as unknown as number,
        billingPeriod: "monthly",
        trialDays: null,
        hasTrial: true,
        isDefault: false,
        features: "",
      });
    }
  }, [open, initialPlanType, form]);

  const onSubmit = async (values: CreatePlanFormValues) => {
    try {
      const features =
        values.features
          ?.split("\n")
          .map((f) => f.trim())
          .filter(Boolean) ?? [];

      await createPlan({
        name: values.name,
        description: values.description ?? null,
        planType: values.planType,
        price: values.price,
        billingPeriod: values.billingPeriod ?? "monthly",
        features,
        trialDays: values.trialDays ?? null,
        hasTrial: values.hasTrial,
        isActive: true,
        isDefault: values.isDefault,
        isPopular: false,
        sortOrder: null,
      });
      showSuccess("Success", "Subscription plan created successfully");
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create subscription plan. Please try again.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Subscription Plan</DialogTitle>
          <DialogDescription>
            Define pricing and features for this platform plan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="min-w-0">
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
                name="planType"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Plan Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as "gym_owner" | "trainer")
                        }
                      >
                        <SelectTrigger className="h-10 w-full min-w-0">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gym_owner">Gym Owner</SelectItem>
                          <SelectItem value="trainer">Trainer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="min-w-0 sm:col-span-2">
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="min-w-0">
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
                name="billingPeriod"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Billing Period</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as BillingPeriod)
                        }
                      >
                        <SelectTrigger className="h-10 w-full min-w-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BILLING_PERIODS.map((period) => (
                            <SelectItem
                              key={period.value}
                              value={period.value}
                            >
                              {period.label}
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
                name="trialDays"
                render={({ field }) => (
                  <FormItem className="min-w-0 sm:col-span-2">
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="hasTrial"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Has Trial</FormLabel>
                    <FormControl>
                      <Input
                        type="checkbox"
                        className="size-4"
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Default Plan</FormLabel>
                    <FormControl>
                      <Input
                        type="checkbox"
                        className="size-4"
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={"Profile visibility\nMember messaging\nClass scheduling"}
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
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Create Plan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

