import { Navigate, useParams } from "react-router-dom";

import { GymApplicationPage } from "@/features/gyms/components";

export default function Page() {
  const { id } = useParams<"id">();
  if (!id) return <Navigate to="/dashboard/gyms" replace />;
  return <GymApplicationPage />;
}

