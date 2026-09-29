import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./shared/Loader";

interface ProtectedRouteProps {
  redirectTo: string;
  role?: string;
}

export const ProtectedRoute = ({
  redirectTo,
  role: requiredRole,
}: ProtectedRouteProps) => {
  const { session, role, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!session) return <Navigate replace to={redirectTo} />;
  if (requiredRole && role !== requiredRole) return <Navigate replace to="/" />;

  return <Outlet />;
};
