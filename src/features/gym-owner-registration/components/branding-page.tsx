import AuthLayout from "@/components/layouts/auth-layout";
import { BrandingStepForm } from "./forms/branding-step-form";

export function BrandingPage() {
  return (
    <AuthLayout>
      <BrandingStepForm />
    </AuthLayout>
  );
}
