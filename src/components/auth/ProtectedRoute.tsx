import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../auth/AuthProvider";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

