import AuthLayout from "@/components/layouts/auth-layout";
import { LocationsStepForm } from "./forms/locations-step-form";

export function LocationsPage() {
  return (
    <AuthLayout>
      <LocationsStepForm />
    </AuthLayout>
  );
}
