import AuthLayout from "@/components/layouts/auth-layout";
import { SignupForm } from "./forms/signup-form";

export function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
