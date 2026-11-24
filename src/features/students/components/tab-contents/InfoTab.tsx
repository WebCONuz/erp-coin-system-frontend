import { useTranslation } from "react-i18next";
import { TabsContent } from "@/components/ui/tabs";
import { Panel } from "@/components/shared/panel";
import { InfoField } from "../ui";
import {
  AtSign,
  Calendar,
  Mail,
  Phone,
  PhoneCall,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { StudentDetailFull } from "../../types";
import { formatDate } from "@/ustils";

/**
 * Shaxsiy va tizim ma'lumotlari. Tahrirlash tugmasi sahifa sarlavhasida —
 * bu yerda takrorlanmaydi.
 */
export const InfoTab = ({ student }: { student?: StudentDetailFull }) => {
  const { t } = useTranslation();

  return (
    <TabsContent value="info" className="mt-4">
      <Panel>
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="font-heading text-sm font-semibold">
              {t("students.infoTab.personalInfo")}
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoField
                icon={<UserRound size={16} />}
                label={t("students.infoTab.fullNameLabel")}
                value={student?.fullName ?? "—"}
              />
              <InfoField
                icon={<Phone size={16} />}
                label={t("common.phone")}
                value={student?.phone ?? "—"}
              />
              <InfoField
                icon={<Mail size={16} />}
                label={t("common.email")}
                value={student?.email ?? "—"}
              />
              {student?.parentPhone && (
                <InfoField
                  icon={<PhoneCall size={16} />}
                  label={t("students.infoTab.parentPhoneLabel")}
                  value={student.parentPhone}
                />
              )}
            </dl>
          </section>

          <section className="space-y-4 border-t pt-6">
            <h3 className="font-heading text-sm font-semibold">
              {t("students.infoTab.systemInfo")}
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoField
                icon={<AtSign size={16} />}
                label={t("username.label")}
                value={student?.username ?? "—"}
              />
              <InfoField
                icon={<ShieldCheck size={16} />}
                label={t("students.infoTab.roleLabel")}
                value={student?.role?.displayName ?? "—"}
              />
              <InfoField
                icon={<Calendar size={16} />}
                label={t("students.infoTab.registeredLabel")}
                value={formatDate(student?.createdAt, "dd.MM.yyyy, HH:mm")}
              />
            </dl>
          </section>
        </div>
      </Panel>
    </TabsContent>
  );
};
