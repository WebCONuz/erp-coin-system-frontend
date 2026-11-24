import { Gift, Home, User, UsersRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AppNavItem } from "./AppSidebar";

/** O'quvchi navigatsiyasi (sidebar va pastki panel uchun bir xil). */
export const useStudentNavItems = (): AppNavItem[] => {
  const { t } = useTranslation();
  return [
    { to: "/student", label: t("admin.header.main"), icon: Home, end: true },
    { to: "/student/profile", label: t("students.header.profile"), icon: User },
    { to: "/student/groups", label: t("admin.header.groups"), icon: UsersRound },
    { to: "/student/market", label: t("admin.header.market"), icon: Gift },
  ];
};
