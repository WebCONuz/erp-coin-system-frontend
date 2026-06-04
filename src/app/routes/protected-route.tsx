import { PageLoader } from "@/components/shared/loaders";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) return <Navigate to="/login" replace />;

  const hasAccess = allowedRoles.includes(user.role.name);
  if (!hasAccess) return <Navigate to="/403" replace />;

  return <Outlet />;
};
