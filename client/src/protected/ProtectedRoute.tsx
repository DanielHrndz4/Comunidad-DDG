import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { ProtectedRouteProps } from "../interfaces/router.interface";

export default function ProtectedRoute({
  allowedRoles,
  children,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { loading, isAuthenticate, user } = useAuth();

  if (loading) return <h3>Loading..</h3>;

  if (!isAuthenticate) return <Navigate to={redirectTo} replace />;

  if (!allowedRoles || allowedRoles.length === 0) {
    return children ? <>{children}</> : <Outlet />;
  }

  if (user?.role && allowedRoles.includes(user.role)) {
    return children ? <>{children}</> : <Outlet />;
  }

  return null;
}