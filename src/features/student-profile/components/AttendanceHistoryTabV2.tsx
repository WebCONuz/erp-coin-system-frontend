import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { TabsContent } from "@/components/ui/tabs";
import { Award, BookOpenCheck, CalendarCheck, Check, X } from "lucide-react";
import type {
  AttendanceRecord,
  StudentDetailFull,
} from "@/features/students/types";
import { getSessionTypeLabel } from "@/features/sessions/constants";
import { formatSessionScore } from "@/features/sessions/utils";
import { formatDate } from "@/ustils";

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

function dateLabel(t: TFunction, sessionDate: string) {
  const d = new Date(sessionDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return t("dates.today");
  if (d.toDateString() === yesterday.toDateString())
    return t("dates.yesterday");
  return formatDate(sessionDate, "dd.MM.yyyy");
}

function groupByDate(t: TFunction, records: AttendanceRecord[]) {
  const map = new Map<string, AttendanceRecord[]>();
  for (const record of records) {
    const key = record.session.sessionDate;
    const list = map.get(key) ?? [];
    list.push(record);
    map.set(key, list);
  }
  return Array.from(map.entries()).map(([sessionDate, records]) => ({
    sessionDate,
    label: dateLabel(t, sessionDate),
    records,
  }));
}

interface Props {
  student?: StudentDetailFull;
}

export const AttendanceHistoryTabV2 = ({ student }: Props) => {
  const { t } = useTranslation();
  const records = student?.attendanceAsStudent ?? [];
  const groups = groupByDate(t, records);

  const presentCount = records.filter((r) => r.isPresent).length;
  // Imtihon/musobaqa (scored) sessiyalarida uy vazifasi tekshirilmaydi.
  const homeworkRecords = records.filter(
    (r) => r.session.evaluationMode !== "scored",
  );
  const homeworkCount = homeworkRecords.filter((r) => r.homeworkDone).length;
  const attendanceRate = records.length
    ? Math.round((presentCount / records.length) * 100)
    : 0;
  const homeworkRate = homeworkRecords.length
    ? Math.round((homeworkCount / homeworkRecords.length) * 100)
    : 0;

  return (
    <TabsContent value="attendance" className="mt-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink">
            {t("studentProfile.attendance.title")}
          </h3>
          <p className="text-xs text-ink-soft mt-0.5">
            {t("studentProfile.attendance.lastRecords", {
              count: records.length,
            })}
          </p>
        </div>

        {records.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-forest/10 text-forest">
              <Check size={12} />
              {t("studentProfile.attendance.attendanceRate", {
                rate: attendanceRate,
              })}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gold/15 text-gold">
              <BookOpenCheck size={12} />
              {t("studentProfile.attendance.homeworkRate", {
                rate: homeworkRate,
              })}
            </span>
          </div>
        )}
      </div>

      {!records.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-ink/10 bg-white">
          <CalendarCheck size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">
            {t("studentProfile.attendance.emptyTitle")}
          </p>
          <p className="text-xs text-ink-soft mt-1 max-w-xs">
            {t("studentProfile.attendance.emptyText")}
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
                            getSessionTypeLabel(t, record.session.sessionType)}
                        </p>
                        {record.note && (
                          <p className="text-xs text-ink-soft italic">
                            {record.note}
                          </p>
                        )}
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
                            {record.isPresent
                              ? t("sessions.attendance.present")
                              : t("sessions.attendance.absent")}
                          </span>
                        </span>
                        {record.session.evaluationMode === "scored" ? (
                          record.isPresent && (
                            <span className="flex items-center justify-center gap-1 px-2 py-1 rounded-full shrink-0 bg-gold/15 text-gold">
                              <Award size={13} />
                              <span className="text-xs">
                                {t("sessions.results.score")}:{" "}
                                {formatSessionScore(
                                  record.score,
                                  record.session.maxScore,
                                )}
                              </span>
                            </span>
                          )
                        ) : (
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
                                ? t("studentProfile.attendance.homeworkDone")
                                : t("studentProfile.attendance.homeworkNotDone")}
                            </span>
                          </span>
                        )}
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
