import {
  BookOpenCheck,
  GraduationCap,
  Home,
  Scale,
  User,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AppNavItem } from "./AppSidebar";

/**
 * O'qituvchi navigatsiyasi. `short` — pastki panel uchun qisqa nomlar.
 * "Tanga qoidalari" ikonkasi admin "Sabablar" bilan bir xil (Scale).
 */
export const useTeacherNavItems = (short = false): AppNavItem[] => {
  const { t } = useTranslation();
  const key = (k: string) => t(short ? `teacherNav.short.${k}` : `teacherNav.${k}`);

  return [
    { to: "/teacher", label: key("main"), icon: Home, end: true },
    { to: "/teacher/groups", label: key("groups"), icon: UsersRound },
    { to: "/teacher/sessions", label: key("sessions"), icon: BookOpenCheck },
    { to: "/teacher/students", label: key("students"), icon: GraduationCap },
    { to: "/teacher/coin-rules", label: key("coinRules"), icon: Scale },
    { to: "/teacher/profile", label: key("profile"), icon: User },
  ];
};
