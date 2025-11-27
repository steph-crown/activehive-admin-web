import AuthLayout from "@/components/layouts/auth-layout";
import { PaymentsStepForm } from "./forms/payments-step-form";

export function PaymentsPage() {
  return (
    <AuthLayout>
      <PaymentsStepForm />
    </AuthLayout>
  );
}
