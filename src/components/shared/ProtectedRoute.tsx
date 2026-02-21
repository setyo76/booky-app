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

  // 1. Jika tidak terautentikasi, lempar ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Jika butuh admin tapi user adalah member biasa, lempar ke home user
  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // 3. Jika ok, render konten di dalamnya
  return <Outlet />;
}