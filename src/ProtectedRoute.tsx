import { Navigate, useLocation } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
