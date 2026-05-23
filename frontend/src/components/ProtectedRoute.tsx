import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token } = useAuth();
  const location = useLocation();

  // Check token from context OR localStorage
  const storedToken = token || localStorage.getItem("token");

  // If no token -> redirect
  if (!storedToken) {
    return (
      <Navigate
        to="/restricted"
        state={{ from: location }}
        replace
      />
    );
  }

  // If token exists -> allow access
  return <Outlet />;
}