import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useVerifyEmailMutation } from "@/features/gym-owner-registration/services";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const { mutateAsync: verifyEmail } = useVerifyEmailMutation();
  const [status, setStatus] = useState<"pending" | "success" | "error" | "missing">(
    "pending"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleVerify = async () => {
      if (!token) {
        setStatus("missing");
        setErrorMessage("Verification link is missing a token.");
        return;
      }

      try {
        await verifyEmail({ token });
        setStatus("success");
        showSuccess("Email verified", "Thanks for confirming. Continue to step 2.");
      } catch (error) {
        setStatus("error");
        const message =
          error instanceof Error ? error.message : "Unable to verify your email.";
        setErrorMessage(message);
        showError("Error", message);
      }
    };

    void handleVerify();
  }, [showError, showSuccess, token, verifyEmail]);

  const goToBranding = () => navigate("/gym-branding");
  const goToSignup = () => navigate("/signup");

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground text-sm">
            We&apos;re confirming your address before unlocking the rest of the
            onboarding steps.
          </p>
        </div>
        {status === "pending" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Verifying token...
          </div>
        )}
        {status === "success" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Email verified. You can keep going with your gym setup.
            </p>
            <Button onClick={goToBranding}>Continue to Step 2</Button>
          </div>
        )}
        {status === "error" && errorMessage && (
          <div className="space-y-4">
            <p className="text-sm text-destructive">{errorMessage}</p>
            <Button variant="outline" onClick={goToSignup}>
              Try signing up again
            </Button>
          </div>
        )}
        {status === "missing" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              That link looks incomplete. Request a new verification email from your
              inbox or start over.
            </p>
            <Button variant="outline" onClick={goToSignup}>
              Back to signup
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
