import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../auth/AuthProvider";

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.isAdmin !== true) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
