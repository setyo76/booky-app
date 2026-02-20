import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectIsAuthenticated } from "@/store/authSlice";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Jika belum login, tendang ke login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "ADMIN") {
    // Jika butuh admin tapi user bukan admin, tendang ke home
    return <Navigate to="/" replace />;
  }

  // Jika semua ok, render anak route-nya (Outlet)
  return <Outlet />;
}