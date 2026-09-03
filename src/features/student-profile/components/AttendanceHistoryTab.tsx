import { TabsContent } from "@/components/ui/tabs";
import { CalendarCheck, Check, X } from "lucide-react";
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
        <h3 className="font-display text-sm font-semibold text-ink">
          Davomat tarixi
        </h3>
        <span className="text-xs text-ink-soft">So'nggi 20 ta</span>
      </div>

      {!records.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-ink/10 bg-white">
          <CalendarCheck size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">
            Davomat tarixi mavjud emas
          </p>
          <p className="text-xs text-ink-soft mt-1 max-w-xs">
            Darslarga qatnashgach, davomat tarixi shu yerda ko'rinadi.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden">
          {records.map((record, idx) => (
            <div
              key={record.id}
              className={`flex items-center justify-between px-4 py-3 ${
                idx !== records.length - 1 ? "border-b border-ink/8" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm text-ink truncate">
                  <b>{record.session.group.name}</b>
                  {record.session.topic ? ` · ${record.session.topic}` : ""}
                </p>
                <p className="text-xs text-ink-soft">
                  {formatDate(record.session.sessionDate, "dd.MM.yyyy")} ·{" "}
                  {SESSION_TYPE_LABELS[record.session.sessionType] ??
                    record.session.sessionType}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    record.isPresent
                      ? "bg-forest/10 text-forest"
                      : "bg-bloom/10 text-bloom"
                  }`}
                >
                  {record.isPresent ? <Check size={11} /> : <X size={11} />}
                  {record.isPresent ? "Keldi" : "Kelmadi"}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                    record.homeworkDone
                      ? "bg-gold/15 text-gold"
                      : "bg-paper-soft text-ink-soft"
                  }`}
                >
                  {record.homeworkDone ? (
                    <Check size={11} />
                  ) : (
                    <X size={11} />
                  )}
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
