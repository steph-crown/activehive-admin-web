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
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
