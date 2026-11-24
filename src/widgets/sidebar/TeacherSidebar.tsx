import { useTranslation } from "react-i18next";
import { AppSidebar } from "./AppSidebar";
import { useTeacherNavItems } from "./useTeacherNavItems";

export const TeacherSidebar = () => {
  const { t } = useTranslation();
  const items = useTeacherNavItems();
  return (
    <AppSidebar
      items={items}
      storageKey="teacher_sidebar_collapsed"
      subtitle={t("teacherNav.cabinet")}
    />
  );
};
