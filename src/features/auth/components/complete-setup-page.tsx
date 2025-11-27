import AuthLayout from "@/components/layouts/auth-layout";
import { CompleteSetupForm } from "./forms/complete-setup-form";

export function CompleteSetupPage() {
  return (
    <AuthLayout>
      <CompleteSetupForm />
    </AuthLayout>
  );
}
