import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../shared/hooks/redux";

export function ProtectedRoute() {
  const authenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
