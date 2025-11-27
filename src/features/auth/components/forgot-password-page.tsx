import AuthLayout from "@/components/layouts/auth-layout";
import { ForgotPasswordForm } from "./forms/forgot-password-form";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
