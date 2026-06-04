import { format, formatDistanceToNow, isValid, parse } from "date-fns";
import { enUS } from "date-fns/locale";

const DATE_STORAGE_FORMAT = "dd.MM.yyyy";
function safeParseDateInput(date: string | Date | undefined): Date | null {
  if (!date) return null;

  try {
    if (date instanceof Date) {
      return isValid(date) ? date : null;
    }

    // Try parsing with DD.MM.YYYY format first
    const parsedDate = parse(date, DATE_STORAGE_FORMAT, new Date());
    if (isValid(parsedDate)) return parsedDate;

    // Try ISO date format as fallback
    const isoDate = new Date(date);
    if (isValid(isoDate)) return isoDate;

    return null;
  } catch (error) {
    console.warn(`Error parsing date: ${date}`, error);
    return null;
  }
}

export function formatDate(
  date: string | Date | undefined,
  formatStr: string = "dd.MM.yyyy",
) {
  const parsedDate = safeParseDateInput(date);
  return parsedDate ? format(parsedDate, formatStr) : "";
}

export function formatDateTime(date: string | undefined | Date) {
  const parsedDate = safeParseDateInput(date);
  return parsedDate ? format(parsedDate, "dd.MM.yyyy HH:mm:ss") : "";
}

export function formatTime(date: string | Date | undefined) {
  const parsedDate = safeParseDateInput(date);
  return parsedDate ? format(parsedDate, "hh:mm a") : "";
}

export function formatDistance(date: string | Date | undefined) {
  const parsedDate = safeParseDateInput(date);
  if (!parsedDate) return "";
  return formatDistanceToNow(parsedDate, {
    addSuffix: true,
    locale: enUS,
  });
}
