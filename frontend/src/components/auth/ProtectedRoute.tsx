import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface StoredUser {
  role?: string;
}

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const getStoredUser = (): StoredUser | null => {
  const rawUser = window.localStorage.getItem("authUser");
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    return null;
  }
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = window.localStorage.getItem("authToken");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role ?? "")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
