import { SignupForm } from "@/components/forms/signup-form";
import AuthLayout from "@/components/layout/AuthLayout";

export default function SignUp() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
