import {
  Phone,
  Mail,
  Pencil,
  UserPlus,
  MessageSquare,
  PhoneCall,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/ustils";
import {
  ActivityItem,
  ContactRow,
  QuickActionRow,
} from "@/features/students/components/ui";
import type { StudentDetailFull } from "../../types";

export const StudentDetailSidebar = ({
  isDeleted,
  setIsMsgOpen,
  setIsEditOpen,
  student,
}: {
  isDeleted: boolean;
  setIsMsgOpen: (open: boolean) => void;
  setIsEditOpen: (open: boolean) => void;
  student?: StudentDetailFull;
}) => {
  const { t } = useTranslation();

  return (
    <aside className="space-y-6">
      {!isDeleted && (
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              {t("students.detail.quickActions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            <QuickActionRow
              icon={
                <MessageSquare
                  size={15}
                  className="text-blue-600 dark:text-blue-400"
                />
              }
              iconBg="bg-blue-100 dark:bg-blue-900/40"
              label={t("students.sendMessage.title")}
              onClick={() => setIsMsgOpen(true)}
            />
            <QuickActionRow
              icon={
                <Pencil
                  size={15}
                  className="text-purple-600 dark:text-purple-400"
                />
              }
              iconBg="bg-purple-100 dark:bg-purple-900/40"
              label={t("students.detail.editInfo")}
              onClick={() => setIsEditOpen(true)}
            />
            <QuickActionRow
              icon={
                <UserPlus
                  size={15}
                  className="text-green-600 dark:text-green-400"
                />
              }
              iconBg="bg-green-100 dark:bg-green-900/40"
              label={t("students.detail.addToGroup")}
            />
          </CardContent>
        </Card>
      )}

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            {t("students.detail.contact")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0.5">
          <ContactRow
            icon={
              <Phone size={15} className="text-blue-600 dark:text-blue-400" />
            }
            iconBg="bg-blue-100 dark:bg-blue-900/40"
            label={t("common.phone")}
            value={student?.phone ?? ""}
          />
          {student?.email && (
            <ContactRow
              icon={
                <Mail size={15} className="text-zinc-600 dark:text-zinc-400" />
              }
              iconBg="bg-zinc-100 dark:bg-zinc-800"
              label={t("common.email")}
              value={student?.email ?? ""}
            />
          )}
          {student?.parentPhone && (
            <ContactRow
              icon={
                <PhoneCall
                  size={15}
                  className="text-green-600 dark:text-green-400"
                />
              }
              iconBg="bg-green-100 dark:bg-green-900/40"
              label={t("students.sendMessage.parent")}
              value={student?.parentPhone ?? ""}
            />
          )}
        </CardContent>
      </Card>

      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            {t("students.detail.recentActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
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
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};
