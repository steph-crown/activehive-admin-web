import AuthLayout from "@/components/layouts/auth-layout";
import { DocumentsStepForm } from "./forms/documents-step-form";

export function DocumentsPage() {
  return (
    <AuthLayout>
      <DocumentsStepForm />
    </AuthLayout>
  );
}
