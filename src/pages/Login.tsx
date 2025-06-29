import AuthLayout from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/login-form";

export default function Login() {
  return (
    <div>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </div>
  );
}
