import { Navigate, useParams } from "react-router-dom";

import { SubscriptionPlanDetailPage } from "@/features/subscriptions/components";

export default function Page() {
  const { id } = useParams<"id">();
  if (!id) return <Navigate to="/dashboard/subscriptions" replace />;
  return <SubscriptionPlanDetailPage />;
}

