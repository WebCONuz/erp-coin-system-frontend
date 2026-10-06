import { t } from "i18next";

const MONTH_KEYS = [
  "dates.months.january",
  "dates.months.february",
  "dates.months.march",
  "dates.months.april",
  "dates.months.may",
  "dates.months.june",
  "dates.months.july",
  "dates.months.august",
  "dates.months.september",
  "dates.months.october",
  "dates.months.november",
  "dates.months.december",
];

export function formatUzMonthDay(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}-${t(MONTH_KEYS[d.getMonth()])}`.toUpperCase();
}

/** "BUGUN · 3-SENTABR" / "ERTAGA · 4-SENTABR" / "12-SENTABR" */
export function relativeUzDayLabel(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formatted = formatUzMonthDay(dateStr);

  if (d.toDateString() === today.toDateString())
    return t("dates.todayWithDate", { date: formatted });
  if (d.toDateString() === tomorrow.toDateString())
    return t("dates.tomorrowWithDate", { date: formatted });
  return formatted;
}
