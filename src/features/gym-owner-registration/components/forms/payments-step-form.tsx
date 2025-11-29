import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { usePaymentAccountsStepMutation } from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "../missing-session-card";
import { cn } from "@/lib/utils";

const paymentAccountSchema = yup.object({
  locationIdentifier: yup.string().required("Location reference is required"),
  accountName: yup.string().required("Account name is required"),
  accountNumber: yup.string().required("Account number is required"),
  routingNumber: yup
    .string()
    .required("Routing number is required")
    .length(9, "Routing number must be exactly 9 digits")
    .matches(/^\d+$/, "Routing number must contain only digits"),
  bankName: yup.string().required("Bank name is required"),
  accountType: yup
    .mixed<"checking" | "savings">()
    .oneOf(["checking", "savings"], "Account type is required")
    .required("Account type is required"),
});

const paymentsSchema = yup.object({
  paymentAccounts: yup
    .array()
    .of(paymentAccountSchema)
    .min(1, "At least one payment account is required"),
});

type PaymentsFormValues = yup.InferType<typeof paymentsSchema>;

export function PaymentsStepForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const sessionId = useGymOwnerRegistrationStore((state) => state.sessionId);
  const setStepStatus = useGymOwnerRegistrationStore(
    (state) => state.setStepStatus
  );
  const { mutateAsync: submitPayments, isPending } =
    usePaymentAccountsStepMutation();

  const form = useForm<PaymentsFormValues>({
    resolver: yupResolver(paymentsSchema),
    defaultValues: {
      paymentAccounts: [
        {
          locationIdentifier: "",
          accountName: "",
          accountNumber: "",
          routingNumber: "",
          bankName: "",
          accountType: "checking",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "paymentAccounts",
  });

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const onSubmit = async (data: PaymentsFormValues) => {
    try {
      await submitPayments({
        sessionId,
        paymentAccounts: data.paymentAccounts.map((account) => ({
          locationIdentifier: account.locationIdentifier,
          paymentAccount: {
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            routingNumber: account.routingNumber,
            bankName: account.bankName,
            accountType: account.accountType,
          },
        })),
      });
      setStepStatus(5, "completed");
      showSuccess(
        "Payment accounts saved",
        "Almost there! Review everything on the final step."
      );
      navigate("/complete-setup");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save payment accounts.";
      showError("Error", message);
    }
  };

  const handleSkip = () => {
    setStepStatus(5, "skipped");
    navigate("/complete-setup");
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Step 5 · Payment accounts</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Add payout details for each location so we know where to send your
            membership revenue.
          </p>
        </div>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-border/60 p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">Account {index + 1}</p>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`paymentAccounts.${index}.locationIdentifier`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location reference</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    <p className="text-muted-foreground text-xs">
                      Reference the location order or identifier from Step 4.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`paymentAccounts.${index}.accountName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account name</FormLabel>
                    <FormControl>
                      <Input placeholder="Gym Account Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name={`paymentAccounts.${index}.accountNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`paymentAccounts.${index}.routingNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456789"
                          maxLength={9}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 9) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <p className="text-muted-foreground text-xs">
                        Must be exactly 9 digits
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name={`paymentAccounts.${index}.bankName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank name</FormLabel>
                      <FormControl>
                        <Input placeholder="Chase Bank" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`paymentAccounts.${index}.accountType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              append({
                locationIdentifier: "",
                accountName: "",
                accountNumber: "",
                routingNumber: "",
                bankName: "",
                accountType: "checking",
              })
            }
          >
            Add another payment account
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? "Saving..." : "Save & continue"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
        </div>
      </form>
    </Form>
  );
}
