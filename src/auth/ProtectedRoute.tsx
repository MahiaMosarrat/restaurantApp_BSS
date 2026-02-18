import { Navigate } from "react-router";
import { useAuth } from "../state-context/auth-context";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { auth } = useAuth();
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};