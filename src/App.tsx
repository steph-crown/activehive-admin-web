import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";
import { BlockLoader } from "@/components/loader/block-loader";

const Login = lazy(() => import("@/app/(auth)/login/page"));
const ForgotPassword = lazy(() => import("@/app/(auth)/forgot-password/page"));
const Dashboard = lazy(() => import("@/app/dashboard/page"));
const Users = lazy(() => import("@/app/dashboard/users/page"));
const GymOwners = lazy(() => import("@/app/dashboard/gym-owners/page"));
const Gyms = lazy(() => import("@/app/dashboard/gyms/page"));
const Locations = lazy(() => import("@/app/dashboard/locations/page"));
const Staff = lazy(() => import("@/app/dashboard/staff/page"));
const Members = lazy(() => import("@/app/dashboard/members/page"));
const Memberships = lazy(() => import("@/app/dashboard/memberships/page"));
const Trainers = lazy(() => import("@/app/dashboard/trainers/page"));
const Subscriptions = lazy(() => import("@/app/dashboard/subscriptions/page"));

function App() {
  return (
    <Router>
      <Suspense fallback={<BlockLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/gym-owners" element={<GymOwners />} />
          <Route path="/dashboard/gyms" element={<Gyms />} />
          <Route path="/dashboard/locations" element={<Locations />} />
          <Route path="/dashboard/staff" element={<Staff />} />
          <Route path="/dashboard/members" element={<Members />} />
          <Route path="/dashboard/memberships" element={<Memberships />} />
          <Route path="/dashboard/trainers" element={<Trainers />} />
          <Route path="/dashboard/subscriptions" element={<Subscriptions />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
