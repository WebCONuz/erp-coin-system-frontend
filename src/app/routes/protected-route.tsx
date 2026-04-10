import { Navigate, Outlet } from "react-router-dom";
// import { useAuthStore } from "@/features/auth/models";

export const ProtectedRoute = ({ allowedRole }: { allowedRole: string }) => {
  // const user = useAuthStore((state) => state.user);        // bu keyinchalik qo'shib qo'yiladi
  const user = { role: "admin" }; // bu keyinchalik olib tashlanadi
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to="/403" replace />;

  return <Outlet />;
};
