import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  useApplicationStatusQuery,
  useCompleteRegistrationMutation,
} from "@/features/gym-owner-registration/services";
import { useGymOwnerRegistrationStore } from "@/store";
import { MissingSessionCard } from "@/features/gym-owner-registration/components/missing-session-card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function CompleteSetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const sessionId = useGymOwnerRegistrationStore((state) => state.sessionId);
  const setStepStatus = useGymOwnerRegistrationStore(
    (state) => state.setStepStatus
  );
  const resetRegistration = useGymOwnerRegistrationStore((state) => state.reset);
  const { data, refetch, isFetching } = useApplicationStatusQuery(sessionId);
  const { mutateAsync: completeRegistration, isPending } =
    useCompleteRegistrationMutation();

  if (!sessionId) {
    return <MissingSessionCard />;
  }

  const handleComplete = async () => {
    try {
      await completeRegistration({ sessionId });
      setStepStatus(6, "completed");
      await refetch();
      showSuccess("Registration submitted", "We’re reviewing your application.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to finish registration.";
      showError("Error", message);
    }
  };

  const handleProceed = () => {
    resetRegistration();
    navigate("/dashboard");
  };

  return (
    <div
      className={cn("flex flex-col gap-6 text-center", className)}
      {...props}
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Step 6 · All done 🎉</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Submit your application for review. We&apos;ll handle the rest and let
          you know as soon as your workspace is ready.
        </p>
      </div>
      <div className="space-y-4">
        {data && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary">
              Status: {data.status ?? "Pending approval"}
            </Badge>
            {data.subscriptionTrialEndsOn && (
              <Badge>
                Trial ends{" "}
                {new Date(data.subscriptionTrialEndsOn).toLocaleDateString()}
              </Badge>
            )}
          </div>
        )}
        {!data && isFetching && (
          <p className="text-muted-foreground text-sm">
            Checking latest application status...
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Button onClick={handleComplete} disabled={isPending}>
          {isPending ? "Submitting..." : "Submit for review"}
        </Button>
        <Button variant="outline" onClick={handleProceed}>
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}
