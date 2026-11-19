import { DEFAULT_TIMEZONE } from "@/features/tenant-settings/constants";

/** Teacher saqlangan yo'qlamani birinchi saqlashdan keyin shuncha vaqt tahrirlay oladi. */
export const ATTENDANCE_EDIT_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * Hozirgi vaqt tenant timezone'ida, `"YYYY-MM-DD HH:MM"` ko'rinishida.
 * Backend "dars boshlandimi" ni tenant timezone bo'yicha hisoblaydi — brauzer
 * vaqt mintaqasi boshqa bo'lsa ham natija bir xil chiqishi uchun.
 */
export const getNowInTimeZone = (timeZone: string = DEFAULT_TIMEZONE) => {
  const parts = (() => {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
    } catch {
      // Noto'g'ri IANA nomi — brauzer vaqti.
      return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
    }
  })();
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
};

/** `sessionDate` (ISO, UTC yarim tun) → `YYYY-MM-DD`. */
export const getSessionDateKey = (sessionDate: string) =>
  sessionDate.slice(0, 10);

/** Dars boshlandimi (sana + `startTime`, tenant timezone bo'yicha). */
export const hasSessionStarted = (
  session: { sessionDate: string; startTime: string },
  timeZone?: string,
) => {
  const now = getNowInTimeZone(timeZone);
  const start = `${getSessionDateKey(session.sessionDate)} ${session.startTime.slice(0, 5)}`;
  return `${now.date} ${now.time}` >= start;
};

/** Teacher uchun tahrirlash muddati tugash vaqti (`checkedAt + 3 kun`). */
export const getAttendanceEditableUntil = (checkedAt?: string | null) => {
  if (!checkedAt) return null;
  const time = new Date(checkedAt).getTime();
  return Number.isNaN(time) ? null : new Date(time + ATTENDANCE_EDIT_WINDOW_MS);
};

export const isAttendanceEditWindowExpired = (checkedAt?: string | null) => {
  const until = getAttendanceEditableUntil(checkedAt);
  return !!until && Date.now() > until.getTime();
};

