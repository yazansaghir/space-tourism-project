import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Protects dashboard routes: redirects to /dashboard/login if not authenticated.
 * Allows any authenticated user (SUPER_ADMIN, ADMIN, EDITOR) into the dashboard.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/dashboard/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
