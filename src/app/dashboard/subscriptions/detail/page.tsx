import { useParams, Navigate } from "react-router-dom";
import { SubscriptionDetailPage } from "@/features/subscriptions/components/subscription-detail-page";

export default function Page() {
  const { id } = useParams<"id">();
  if (!id) return <Navigate to="/dashboard/subscriptions" replace />;
  return <SubscriptionDetailPage subscriptionId={id} />;
}
