import { TabsContent } from "@/components/ui/tabs";
import { BookOpenCheck, CalendarCheck, Check, X } from "lucide-react";
import type {
  AttendanceRecord,
  StudentDetailFull,
} from "@/features/students/types";
import { formatDate } from "@/ustils";

const SESSION_TYPE_LABELS: Record<string, string> = {
  lesson: "Dars",
  exam: "Imtihon",
  trial: "Sinov",
};

const AVATAR_STYLES = [
  "bg-forest/10 text-forest",
  "bg-gold/15 text-gold",
  "bg-bloom/10 text-bloom",
];

function avatarStyle(seed: string) {
  const sum = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_STYLES[sum % AVATAR_STYLES.length];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function dateLabel(sessionDate: string) {
  const d = new Date(sessionDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Bugun";
  if (d.toDateString() === yesterday.toDateString()) return "Kecha";
  return formatDate(sessionDate, "dd.MM.yyyy");
}

function groupByDate(records: AttendanceRecord[]) {
  const map = new Map<string, AttendanceRecord[]>();
  for (const record of records) {
    const key = record.session.sessionDate;
    const list = map.get(key) ?? [];
    list.push(record);
    map.set(key, list);
  }
  return Array.from(map.entries()).map(([sessionDate, records]) => ({
    sessionDate,
    label: dateLabel(sessionDate),
    records,
  }));
}

interface Props {
  student?: StudentDetailFull;
}

export const AttendanceHistoryTabV2 = ({ student }: Props) => {
  const records = student?.attendanceAsStudent ?? [];
  const groups = groupByDate(records);

  const presentCount = records.filter((r) => r.isPresent).length;
  const homeworkCount = records.filter((r) => r.homeworkDone).length;
  const attendanceRate = records.length
    ? Math.round((presentCount / records.length) * 100)
    : 0;
  const homeworkRate = records.length
    ? Math.round((homeworkCount / records.length) * 100)
    : 0;

  return (
    <TabsContent value="attendance" className="mt-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink">
            Davomat tarixi
          </h3>
          <p className="text-xs text-ink-soft mt-0.5">
            So'nggi {records.length} ta yozuv
          </p>
        </div>

        {records.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-forest/10 text-forest">
              <Check size={12} />
              {attendanceRate}% qatnashuv
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gold/15 text-gold">
              <BookOpenCheck size={12} />
              {homeworkRate}% uy vazifa
            </span>
          </div>
        )}
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
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.sessionDate}>
              <p className="text-[11px] font-semibold tracking-wide text-ink-soft/70 uppercase mb-2 px-1">
                {group.label}
              </p>
              <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden divide-y divide-ink/8">
                {group.records.map((record) => {
                  const title =
                    record.session.subject?.name ?? record.session.group.name;

                  return (
                    <div
                      key={record.id}
                      className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-y-0 px-4 py-3 transition-colors hover:bg-paper-soft/60"
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${avatarStyle(
                          record.session.group.id,
                        )}`}
                      >
                        {initials(title)}
                      </div>

                      <div className="min-w-40 flex-1">
                        <p className="text-sm text-ink">
                          <b>{title}</b>
                          {record.session.subject
                            ? ` · ${record.session.group.name}`
                            : ""}
                        </p>
                        <p className="text-xs text-ink-soft">
                          {record.session.startTime}–{record.session.endTime}
                          {" · "}
                          {record.session.topic ??
                            SESSION_TYPE_LABELS[record.session.sessionType] ??
                            record.session.sessionType}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap shrink-0 pl-12 sm:pl-0">
                        <span
                          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                            record.isPresent
                              ? "bg-forest/10 text-forest"
                              : "bg-bloom/10 text-bloom"
                          }`}
                        >
                          {record.isPresent ? (
                            <Check size={11} />
                          ) : (
                            <X size={11} />
                          )}
                          <span className="text-xs">
                            {record.isPresent ? "Keldi" : "Kelmadi"}
                          </span>
                        </span>
                        <span
                          className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full shrink-0 ${
                            record.homeworkDone
                              ? "bg-green-100 text-green-600 "
                              : "bg-gold/15 text-gold"
                          }`}
                        >
                          <BookOpenCheck size={13} />
                          <span className="text-xs">
                            {record.homeworkDone
                              ? "Uy vazifasi bajarilgan"
                              : "Uy vazifasi bajarilmagan"}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
};
