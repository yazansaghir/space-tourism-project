import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Renders children only if the user is SUPER_ADMIN or has the required permission.
 * Otherwise redirects to /dashboard (Overview).
 */
export default function PermissionRoute({ permission, children }) {
  const { user } = useAuth();
  const hasAccess = user?.role === "SUPER_ADMIN" || (user?.permissions || []).includes(permission);

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
