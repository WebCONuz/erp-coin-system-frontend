import { Mail, Phone, PhoneCall } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/shared/panel";
import { formatDate } from "@/ustils";
import { ActivityItem, ContactRow } from "@/features/students/components/ui";
import type { StudentDetailFull } from "../../types";

/**
 * Yon panel: aloqa (nusxa olish bilan) va so'nggi faollik.
 * Tezkor amallar sarlavhadagi tugmalarni takrorlagani uchun olib tashlangan.
 */
export const StudentDetailSidebar = ({
  student,
}: {
  student?: StudentDetailFull;
}) => {
  const { t } = useTranslation();

  return (
    <aside className="space-y-4 sm:space-y-5">
      <Panel title={t("students.detail.contact")} flush>
        <ul className="px-2 pb-2">
          <ContactRow
            icon={Phone}
            label={t("common.phone")}
            value={student?.phone ?? ""}
          />
          {student?.parentPhone && (
            <ContactRow
              icon={PhoneCall}
              label={t("students.sendMessage.parent")}
              value={student.parentPhone}
            />
          )}
          {student?.email && (
            <ContactRow
              icon={Mail}
              label={t("common.email")}
              value={student.email}
            />
          )}
        </ul>
      </Panel>

      <Panel title={t("students.detail.recentActivity")}>
        <ol>
          <ActivityItem
            active
            label={t("students.detail.infoUpdated")}
            time={formatDate(student?.updatedAt, "dd.MM.yyyy, HH:mm")}
          />
          <ActivityItem
            last
            label={t("students.detail.registered")}
            time={formatDate(student?.createdAt, "dd.MM.yyyy, HH:mm")}
          />
        </ol>
      </Panel>
    </aside>
  );
};
