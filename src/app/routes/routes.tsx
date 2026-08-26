import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthLayout from "@/app/layouts/AuthLayout";
import AdminLayout from "@/app/layouts/AdminLayout";
import StudentLayout from "@/app/layouts/StudentLayout";
import { ProtectedRoute } from "./protected-route";
import { PageLoader } from "@/components/shared/loaders";
import NotFoundPage from "@/pages/errors/NotFound";
import ForbiddenPage from "@/pages/errors/Forbidden";
import LoginPage from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import { ROLES } from "@/assets/constants";

// Lazy Pages (Code Splitting)
// student
const StudentDashboard = lazy(
  () => import("@/pages/dashboard/student/Dashboard"),
);
const StudentGroups = lazy(() => import("@/pages/groups/student/Group"));
const Market = lazy(() => import("@/pages/market/Market"));

// admin
const TenantsList = lazy(() => import("@/pages/tenants/TenantsList"));
const AdminDashboard = lazy(() => import("@/pages/dashboard/admin/Dashboard"));
const AdminTeachers = lazy(() => import("@/pages/teachers/admin/Teachers"));
const AdminTeacherDetail = lazy(
  () => import("@/pages/teachers/admin/TeacherDetail"),
);
const AdminGroups = lazy(() => import("@/pages/groups/admin/Groups"));
const GroupDetail = lazy(() => import("@/pages/groups/admin/GroupDetail"));
const AdminStudents = lazy(() => import("@/pages/students/admin/Students"));
const AdminStudentDetail = lazy(
  () => import("@/pages/students/admin/StudentDetail"),
);
const AdminControlLayput = lazy(
  () => import("@/pages/control/admin/AdminControlLayout"),
);
const AdminSessions = lazy(() => import("@/pages/sessions/SessionsPage"));
const AdminSessionDetail = lazy(
  () => import("@/pages/sessions/SessionDetailPage"),
);
const PlansPage = lazy(() => import("@/pages/plans/admin/PlansPage"));
const EmployeesPage = lazy(() => import("@/pages/control/admin/EmployeesPage"));
const RoomsPage = lazy(() => import("@/pages/control/admin/RoomsPage"));
const ReasonsPage = lazy(() => import("@/pages/control/admin/ReasonsPage"));
const SendMessagePage = lazy(
  () => import("@/pages/control/admin/SendMessagePage"),
);
const RolesPage = lazy(() => import("@/pages/control/admin/RolesPage"));

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
    element: (
      <ProtectedRoute
        allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.CREATOR]}
      />
    ),
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
            path: "teachers/:id",
            element: withSuspense(AdminTeacherDetail),
          },
          {
            path: "groups",
            element: withSuspense(AdminGroups),
          },
          {
            path: "groups/:id",
            element: withSuspense(GroupDetail),
          },
          {
            path: "students",
            element: withSuspense(AdminStudents),
          },
          {
            path: "students/:id",
            element: withSuspense(AdminStudentDetail),
          },
          {
            path: "market",
            element: withSuspense(Market),
          },
          {
            path: "tenants",
            element: withSuspense(TenantsList),
          },
          {
            path: "sessions",
            element: withSuspense(AdminSessions),
          },
          {
            path: "sessions/:id",
            element: withSuspense(AdminSessionDetail),
          },
          {
            path: "plans",
            element: withSuspense(PlansPage),
          },
          {
            path: "control",
            element: withSuspense(AdminControlLayput),
            children: [
              {
                index: true,
                element: <Navigate to="reasons" replace />,
              },
              {
                path: "rooms",
                element: withSuspense(RoomsPage),
              },
              {
                path: "reasons",
                element: withSuspense(ReasonsPage),
              },
              {
                path: "send-message",
                element: withSuspense(SendMessagePage),
              },
              {
                path: "roles",
                element: withSuspense(RolesPage),
              },
              {
                path: "employees",
                element: withSuspense(EmployeesPage),
              },
            ],
          },
        ],
      },
    ],
  },

  // STUDENT ROUTES
  {
    path: "/student",
    element: <ProtectedRoute allowedRoles={[ROLES.STUDENT]} />,
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

  // 403
  {
    path: "/403",
    element: withSuspense(ForbiddenPage),
  },

  // 404
  {
    path: "*",
    element: withSuspense(NotFoundPage),
  },
]);
