import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { SessionEvaluation } from "../../hooks";
import { EVALUATION_TONES, type EvaluationTone } from "./tones";

interface Props {
  evaluation: SessionEvaluation;
  disabled: boolean;
  tone: EvaluationTone;
}

export const SessionAttendanceTable = ({
  evaluation,
  disabled,
  tone,
}: Props) => {
  const { t } = useTranslation();
  const styles = EVALUATION_TONES[tone];
  const { students, attendanceRecords, toggleAttendance, toggleAllAttendance } =
    evaluation;

  const recordValues = Object.values(attendanceRecords);
  const allPresent =
    recordValues.length > 0 && recordValues.every((r) => r.isPresent);
  const somePresent = recordValues.some((r) => r.isPresent);
  const allHomeworkDone =
    recordValues.length > 0 && recordValues.every((r) => r.homeworkDone);
  const someHomeworkDone = recordValues.some((r) => r.homeworkDone);

  return (
    <div className={styles.table}>
      <table className="w-full text-sm">
        <thead className={styles.thead}>
          <tr>
            <th className={cn(styles.th, "text-left")}>
              {t("common.student")}
            </th>
            <th className={cn(styles.th, "text-left")}>{t("common.phone")}</th>
            <th className={cn(styles.th, "text-center")}>
              <div className="flex items-center justify-center gap-2">
                <Checkbox
                  isMinusIcon={somePresent && !allPresent}
                  checked={allPresent}
                  disabled={disabled}
                  onCheckedChange={() =>
                    toggleAllAttendance("isPresent", !allPresent)
                  }
                />
                {t("sessions.attendance.present")}
              </div>
            </th>
            <th className={cn(styles.th, "text-center")}>
              <div className="flex items-center justify-center gap-2">
                <Checkbox
                  isMinusIcon={someHomeworkDone && !allHomeworkDone}
                  checked={allHomeworkDone}
                  disabled={disabled}
                  onCheckedChange={() =>
                    toggleAllAttendance("homeworkDone", !allHomeworkDone)
                  }
                />
                {t("sessions.attendance.homework")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const record = attendanceRecords[student.id] ?? {
              isPresent: false,
              homeworkDone: false,
            };

            return (
              <tr key={student.id} className={styles.row}>
                <td className={cn("px-4 py-2.5", styles.text)}>
                  {student.fullName}
                </td>
                <td className={cn("px-4 py-2.5", styles.muted)}>
                  {student.phone}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <Checkbox
                    checked={record.isPresent}
                    disabled={disabled}
                    onCheckedChange={() =>
                      toggleAttendance(student.id, "isPresent")
                    }
                  />
                </td>
                <td className="px-4 py-2.5 text-center">
                  <Checkbox
                    checked={record.homeworkDone}
                    disabled={disabled}
                    onCheckedChange={() =>
                      toggleAttendance(student.id, "homeworkDone")
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
