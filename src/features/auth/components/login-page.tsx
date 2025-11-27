import AuthLayout from "@/components/layouts/auth-layout";
import { LoginForm } from "./forms/login-form";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
