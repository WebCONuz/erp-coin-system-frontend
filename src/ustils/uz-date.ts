const UZ_MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

export function formatUzMonthDay(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}`.toUpperCase();
}

/** "BUGUN · 3-SENTABR" / "ERTAGA · 4-SENTABR" / "12-SENTABR" */
export function relativeUzDayLabel(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formatted = formatUzMonthDay(dateStr);

  if (d.toDateString() === today.toDateString()) return `BUGUN · ${formatted}`;
  if (d.toDateString() === tomorrow.toDateString())
    return `ERTAGA · ${formatted}`;
  return formatted;
}
