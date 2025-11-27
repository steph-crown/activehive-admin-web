import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocationsStepMutation } from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "../missing-session-card";
import { cn } from "@/lib/utils";

type LocationFormState = {
  locationName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
};

const createEmptyLocation = (): LocationFormState => ({
  locationName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  phone: "",
  email: "",
});

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
  const [locations, setLocations] = useState<LocationFormState[]>([
    createEmptyLocation(),
  ]);

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const handleLocationChange = (
    index: number,
    field: keyof LocationFormState,
    value: string
  ) => {
    setLocations((prev) =>
      prev.map((location, idx) =>
        idx === index ? { ...location, [field]: value } : location
      )
    );
  };

  const handleAddLocation = () => {
    setLocations((prev) => [...prev, createEmptyLocation()]);
  };

  const handleRemoveLocation = (index: number) => {
    setLocations((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      return updated.length === 0 ? [createEmptyLocation()] : updated;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (locations.some((loc) => Object.values(loc).some((value) => !value))) {
      showError("Error", "Please complete every field for each location.");
      return;
    }

    try {
      await submitLocations({
        sessionId,
        hasMultipleLocations: locations.length > 1,
        locations,
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
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
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
        {locations.map((location, index) => (
          <div
            key={index}
            className="rounded-lg border border-border/60 p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">Location {index + 1}</p>
              {locations.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveLocation(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            <div className="grid gap-3">
              <Label>Name</Label>
              <Input
                value={location.locationName}
                onChange={(event) =>
                  handleLocationChange(index, "locationName", event.target.value)
                }
                placeholder="Main Gym"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label>Address</Label>
              <Input
                value={location.address}
                onChange={(event) =>
                  handleLocationChange(index, "address", event.target.value)
                }
                placeholder="123 Main Street"
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="grid gap-3">
                <Label>City</Label>
                <Input
                  value={location.city}
                  onChange={(event) =>
                    handleLocationChange(index, "city", event.target.value)
                  }
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label>State / Region</Label>
                <Input
                  value={location.state}
                  onChange={(event) =>
                    handleLocationChange(index, "state", event.target.value)
                  }
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label>Zip code</Label>
                <Input
                  value={location.zipCode}
                  onChange={(event) =>
                    handleLocationChange(index, "zipCode", event.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-3">
                <Label>Country</Label>
                <Input
                  value={location.country}
                  onChange={(event) =>
                    handleLocationChange(index, "country", event.target.value)
                  }
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label>Phone</Label>
                <Input
                  value={location.phone}
                  onChange={(event) =>
                    handleLocationChange(index, "phone", event.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>
            <div className="grid gap-3">
              <Label>Email</Label>
              <Input
                type="email"
                value={location.email}
                onChange={(event) =>
                  handleLocationChange(index, "email", event.target.value)
                }
                placeholder="location@gym.com"
                required
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleAddLocation}
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
  );
}
