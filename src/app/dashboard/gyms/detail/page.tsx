import { useParams, Navigate } from "react-router-dom";
import { GymDetailPage } from "@/features/gyms/components/gym-detail-page";

export default function Page() {
  const { id } = useParams<"id">();
  if (!id) return <Navigate to="/dashboard/gyms" replace />;
  return <GymDetailPage gymId={id} />;
}
