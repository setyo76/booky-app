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

  // 1. 
If not authenticated, throw to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If you need an admin but the user is a regular member, throw it to the home user.
  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // 3. If ok, render the content inside
  return <Outlet />;
}