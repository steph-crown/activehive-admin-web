import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus, X } from "lucide-react";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BILLING_PERIODS, type BillingPeriod } from "../constants";
import { useCreateSubscriptionPlanMutation, usePlanFeatureFlagsQuery } from "../services";

const FEATURE_PLACEHOLDERS = [
  "Unlimited member management",
  "Class scheduling",
  "Staff management",
  "Analytics & reports",
  "Mobile app access",
];

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
  hasTrial: yup.boolean().required(),
  trialDays: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || Number.isNaN(value) ? null : value,
    )
    .when("hasTrial", {
      is: true,
      then: (s) =>
        s.required("Trial days is required").min(1, "Must be at least 1 day"),
      otherwise: (s) => s.optional(),
    }),
  features: yup
    .array()
    .of(yup.string())
    .test(
      "has-feature",
      "At least one feature is required",
      (arr) => Boolean((arr ?? []).some((f) => f?.trim())),
    )
    .required(),
  featureFlags: yup.array().of(yup.string()).optional(),
  maxStaff: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || Number.isNaN(value) ? null : value,
    )
    .min(0, "Must be 0 or more")
    .optional(),
  maxLocations: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || Number.isNaN(value) ? null : value,
    )
    .min(0, "Must be 0 or more")
    .optional(),
  maxClassesPerMonth: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || Number.isNaN(value) ? null : value,
    )
    .min(0, "Must be 0 or more")
    .optional(),
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
  const { data: availableFlags = [] } = usePlanFeatureFlagsQuery();

  const form = useForm<CreatePlanFormValues>({
    resolver: yupResolver(createPlanSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      planType: initialPlanType,
      price: "" as unknown as number,
      billingPeriod: "monthly",
      hasTrial: true,
      trialDays: null,
      features: [""],
      featureFlags: [],
      maxStaff: null,
      maxLocations: null,
      maxClassesPerMonth: null,
    },
  });

  const hasTrial = useWatch({ control: form.control, name: "hasTrial" });
  const features = useWatch({ control: form.control, name: "features" });
  const featureFlags = useWatch({ control: form.control, name: "featureFlags" });

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        description: "",
        planType: initialPlanType,
        price: "" as unknown as number,
        billingPeriod: "monthly",
        hasTrial: true,
        trialDays: null,
        features: [""],
        featureFlags: [],
        maxStaff: null,
        maxLocations: null,
        maxClassesPerMonth: null,
      });
    }
  }, [open, initialPlanType, form]);

  const shouldValidate = { shouldValidate: form.formState.isSubmitted };

  const addFeature = () => {
    form.setValue("features", [...(features ?? []), ""], shouldValidate);
  };

  const removeFeature = (index: number) => {
    const current = features ?? [];
    form.setValue(
      "features",
      current.filter((_, i) => i !== index),
      shouldValidate,
    );
  };

  const updateFeature = (index: number, value: string) => {
    const current = [...(features ?? [])];
    current[index] = value;
    form.setValue("features", current, shouldValidate);
  };

  const toggleFlag = (value: string) => {
    const current = featureFlags ?? [];
    const next = current.includes(value)
      ? current.filter((f) => f !== value)
      : [...current, value];
    form.setValue("featureFlags", next, shouldValidate);
  };

  const onSubmit = async (values: CreatePlanFormValues) => {
    try {
      await createPlan({
        name: values.name,
        description: values.description ?? null,
        planType: values.planType,
        price: values.price,
        billingPeriod: values.billingPeriod ?? "monthly",
        features: (values.features ?? []).filter((f): f is string => Boolean(f)),
        featureFlags: (values.featureFlags ?? []).filter((f): f is string => Boolean(f)),
        maxStaff: values.maxStaff ?? null,
        maxLocations: values.maxLocations ?? null,
        maxClassesPerMonth: values.maxClassesPerMonth ?? null,
        trialDays: values.hasTrial ? (values.trialDays ?? null) : null,
        hasTrial: values.hasTrial,
        isActive: true,
        isDefault: false,
        isPopular: false,
        sortOrder: null,
      });
      showSuccess("Success", "Subscription plan created successfully");
      onOpenChange(false);
    } catch (error) {
      showError("Error", getApiErrorMessage(error, "Failed to create subscription plan. Please try again."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Subscription Plan</DialogTitle>
          <DialogDescription>
            Define pricing and features for this platform plan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0 gap-4"
          >
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
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
            </div>

            <FormField
              control={form.control}
              name="hasTrial"
              render={({ field }) => (
                <FormItem className="min-w-0">
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
                  <FormItem className="min-w-0">
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

            {/* Marketing features (free-text display copy) */}
            <div>
              <FormLabel>Features <span className="text-muted-foreground font-normal text-xs">(displayed to users)</span></FormLabel>
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

            {/* Enforced capability flags */}
            {availableFlags.length > 0 && (
              <div>
                <FormLabel>Feature Flags <span className="text-muted-foreground font-normal text-xs">(enforced by backend)</span></FormLabel>
                <div className="mt-2 space-y-2">
                  {availableFlags.map((flag) => (
                    <label
                      key={flag.value}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <Checkbox
                        checked={(featureFlags ?? []).includes(flag.value)}
                        onCheckedChange={() => toggleFlag(flag.value)}
                      />
                      <span className="text-sm">{flag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Numeric limits */}
            <div>
              <FormLabel>Plan Limits <span className="text-muted-foreground font-normal text-xs">(leave blank for unlimited)</span></FormLabel>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="maxStaff"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel className="text-xs font-normal text-muted-foreground">Max staff</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Unlimited"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? null : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxLocations"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel className="text-xs font-normal text-muted-foreground">Max locations</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Unlimited"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? null : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxClassesPerMonth"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel className="text-xs font-normal text-muted-foreground">Max classes/month</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Unlimited"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? null : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
                Create Plan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
