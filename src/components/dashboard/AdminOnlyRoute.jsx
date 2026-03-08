import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Renders children only if the current user is SUPER_ADMIN.
 * Otherwise redirects to /dashboard (Overview).
 */
export default function AdminOnlyRoute({ children }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
