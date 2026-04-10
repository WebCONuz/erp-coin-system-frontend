import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthLayout from "@/app/layouts/AuthLayout";
import AdminLayout from "@/app/layouts/AdminLayout";
import StudentLayout from "@/app/layouts/StudentLayout";
import { ProtectedRoute } from "./protected-route";
import { PageLoader } from "@/components/shared/loaders";
import NotFound from "@/pages/errors/NotFound";
import LoginPage from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// Lazy Pages (Code Splitting)
// student
const StudentDashboard = lazy(
  () => import("@/pages/dashboard/student/Dashboard"),
);
const StudentGroups = lazy(() => import("@/pages/groups/student/Group"));
const Market = lazy(() => import("@/pages/market/Market"));

// admin
const AdminDashboard = lazy(() => import("@/pages/dashboard/admin/Dashboard"));
const AdminTeachers = lazy(() => import("@/pages/teachers/admin/Teachers"));
const AdminGroups = lazy(() => import("@/pages/groups/admin/Groups"));
const AdminStudents = lazy(() => import("@/pages/students/admin/Students"));
const AdminControl = lazy(() => import("@/pages/control/admin/Control"));

const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  // AUTH ROUTES
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: withSuspense(LoginPage),
      },
      {
        path: "register",
        element: withSuspense(Register),
      },
      {
        path: "forgot-password",
        element: withSuspense(ForgotPassword),
      },
    ],
  },

  // ADMIN ROUTES
  {
    path: "/admin",
    element: <ProtectedRoute allowedRole="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: withSuspense(AdminDashboard),
          },
          {
            path: "teachers",
            element: withSuspense(AdminTeachers),
          },
          {
            path: "groups",
            element: withSuspense(AdminGroups),
          },
          {
            path: "students",
            element: withSuspense(AdminStudents),
          },
          {
            path: "market",
            element: withSuspense(Market),
          },
          {
            path: "control",
            element: withSuspense(AdminControl),
          },
        ],
      },
    ],
  },

  // STUDENT ROUTES
  {
    path: "/student",
    element: <ProtectedRoute allowedRole="student" />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          {
            index: true,
            element: withSuspense(StudentDashboard),
          },
          {
            path: "groups",
            element: withSuspense(StudentGroups),
          },
          {
            path: "market",
            element: withSuspense(Market),
          },
        ],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: withSuspense(NotFound),
  },
]);
