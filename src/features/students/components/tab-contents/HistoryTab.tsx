import { useTranslation } from "react-i18next";
import { TabsContent } from "@/components/ui/tabs";
import { EntityAuditHistory } from "@/features/audit-logs/components";
import type { StudentDetailFull } from "../../types";

/** O'quvchi ustidagi amallar tarixi — `GET /audit-logs?entityId=<studentId>`. */
export const HistoryTab = ({ student }: { student: StudentDetailFull }) => {
  const { t } = useTranslation();

  return (
    <TabsContent value="history" className="mt-4">
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t("students.historyTab.title")}
        </h3>
        <EntityAuditHistory
          entityId={student.id}
          emptyText={t("students.historyTab.empty")}
        />
      </div>
    </TabsContent>
  );
};
