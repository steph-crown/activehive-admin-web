import AuthLayout from "@/components/layouts/auth-layout";
import { OtpForm } from "./forms/otp-form";

export function OtpPage() {
  return (
    <AuthLayout>
      <OtpForm />
    </AuthLayout>
  );
}
