import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { InfoField } from "../ui";
import {
  Calendar,
  Mail,
  Pencil,
  Phone,
  PhoneCall,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { StudentDetailFull } from "../../types";
import { formatDate } from "@/ustils";
import { Button } from "@/components/ui/button";

export const InfoTab = ({
  student,
  isDeleted,
  setIsEditOpen,
}: {
  student?: StudentDetailFull;
  isDeleted: boolean;
  setIsEditOpen: (a: boolean) => void;
}) => {
  const { t } = useTranslation();

  return (
    <TabsContent value="info" className="mt-4">
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              {t("students.infoTab.personalInfo")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField
                icon={<Users size={15} />}
                label={t("students.infoTab.fullNameLabel")}
                value={student?.fullName ?? "-"}
              />
              <InfoField
                icon={<Phone size={15} />}
                label={t("common.phone")}
                value={student?.phone ?? "-"}
              />
              <InfoField
                icon={<Mail size={15} />}
                label={t("common.email")}
                value={student?.email ?? "—"}
              />
              {student?.parentPhone && (
                <InfoField
                  icon={<PhoneCall size={15} />}
                  label={t("students.infoTab.parentPhoneLabel")}
                  value={student?.parentPhone}
                />
              )}
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              {t("students.infoTab.systemInfo")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField
                icon={<ShieldCheck size={15} />}
                label={t("students.infoTab.roleLabel")}
                value={student?.role?.displayName ?? "-"}
              />
              <InfoField
                icon={<Calendar size={15} />}
                label={t("students.infoTab.registeredLabel")}
                value={formatDate(student?.createdAt, "dd.MM.yyyy, HH:mm")}
              />
            </div>
          </div>

          {!isDeleted && (
            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                className="gap-2 bg-linear-to-br from-purple-500 to-purple-700 h-10 px-4 text-white"
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil size={14} />
                {t("students.infoTab.editButton")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
