import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocationsStepMutation } from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "../missing-session-card";
import { cn } from "@/lib/utils";

const locationSchema = yup.object({
  locationName: yup.string().required("Location name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State/Region is required"),
  zipCode: yup.string().required("Zip code is required"),
  country: yup.string().required("Country is required"),
  phone: yup.string().required("Phone is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const locationsSchema = yup.object({
  locations: yup
    .array()
    .of(locationSchema)
    .min(1, "At least one location is required"),
});

type LocationsFormValues = yup.InferType<typeof locationsSchema>;

export function LocationsStepForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const sessionId = useGymOwnerRegistrationStore((state) => state.sessionId);
  const setStepStatus = useGymOwnerRegistrationStore(
    (state) => state.setStepStatus
  );
  const { mutateAsync: submitLocations, isPending } =
    useLocationsStepMutation();

  const form = useForm<LocationsFormValues>({
    resolver: yupResolver(locationsSchema),
    defaultValues: {
      locations: [
        {
          locationName: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          phone: "",
          email: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const onSubmit = async (data: LocationsFormValues) => {
    try {
      await submitLocations({
        sessionId,
        hasMultipleLocations: data.locations.length > 1,
        locations: data.locations,
      });
      setStepStatus(4, "completed");
      showSuccess("Locations saved", "Now set up your payout accounts.");
      navigate("/payment-setup");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save locations.";
      showError("Error", message);
    }
  };

  const handleSkip = () => {
    setStepStatus(4, "skipped");
    navigate("/payment-setup");
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Step 4 · Gym locations</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Add each address you operate from. You can always come back to add more
            later.
          </p>
        </div>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-border/60 p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">Location {index + 1}</p>
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
                name={`locations.${index}.locationName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Gym" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${index}.address`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name={`locations.${index}.city`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`locations.${index}.state`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Region</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`locations.${index}.zipCode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name={`locations.${index}.country`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`locations.${index}.phone`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`locations.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="location@gym.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              append({
                locationName: "",
                address: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
                phone: "",
                email: "",
              })
            }
          >
            Add another location
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
