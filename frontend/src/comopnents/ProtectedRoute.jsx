import { Navigate, Outlet, useLocation } from "react-router-dom";
import authService from "../services/authService";

export default function ProtectedRoute() {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}