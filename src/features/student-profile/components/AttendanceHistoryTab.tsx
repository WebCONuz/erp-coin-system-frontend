import { TabsContent } from "@/components/ui/tabs";
import { CalendarCheck, Check, X } from "lucide-react";
import { EmptyState } from "@/features/students/components/ui";
import type { StudentDetailFull } from "@/features/students/types";
import { formatDate } from "@/ustils";

const SESSION_TYPE_LABELS: Record<string, string> = {
  lesson: "Dars",
  exam: "Imtihon",
  trial: "Sinov",
};

interface Props {
  student?: StudentDetailFull;
}

export const AttendanceHistoryTab = ({ student }: Props) => {
  const records = student?.attendanceAsStudent ?? [];

  return (
    <TabsContent value="attendance" className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Davomat tarixi
        </h3>
        <span className="text-xs text-zinc-400">So'nggi 20 ta</span>
      </div>

      {!records.length ? (
        <EmptyState
          icon={<CalendarCheck size={20} />}
          title="Davomat tarixi mavjud emas"
          text="Darslarga qatnashgach, davomat tarixi shu yerda ko'rinadi."
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {records.map((record, idx) => (
            <div
              key={record.id}
              className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 ${
                idx !== records.length - 1
                  ? "border-b border-zinc-100 dark:border-zinc-800"
                  : ""
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
                  <b>{record.session.group.name}</b>
                  {record.session.topic ? ` · ${record.session.topic}` : ""}
                </p>
                <p className="text-xs text-zinc-400">
                  {formatDate(record.session.sessionDate, "dd.MM.yyyy")} ·{" "}
                  {SESSION_TYPE_LABELS[record.session.sessionType] ??
                    record.session.sessionType}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-4xl ${
                    record.isPresent
                      ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                  }`}
                >
                  {record.isPresent ? <Check size={11} /> : <X size={11} />}
                  {record.isPresent ? "Keldi" : "Kelmadi"}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-4xl ${
                    record.homeworkDone
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {record.homeworkDone ? <Check size={11} /> : <X size={11} />}
                  HW
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
};
