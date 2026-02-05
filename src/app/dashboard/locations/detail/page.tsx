import { useParams, Navigate } from "react-router-dom";
import { LocationDetailPage } from "@/features/locations/components/location-detail-page";

export default function Page() {
  const { id } = useParams<"id">();
  if (!id) return <Navigate to="/dashboard/locations" replace />;
  return <LocationDetailPage locationId={id} />;
}
