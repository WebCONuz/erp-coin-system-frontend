import { differenceInCalendarDays } from "date-fns";

/** i18n til kodi → Intl locale. */
const INTL_LOCALES: Record<string, string> = {
  uz: "uz-Latn",
  uz_cr: "uz-Cyrl",
  ru: "ru",
};

export const toIntlLocale = (lang: string) => INTL_LOCALES[lang] ?? "uz-Latn";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Payshanba, 27-noyabr" (yil joriy yildan farq qilsa qo'shiladi). */
export const formatLongDate = (date: Date, lang: string) => {
  try {
    const withYear = date.getFullYear() !== new Date().getFullYear();
    return capitalize(
      new Intl.DateTimeFormat(toIntlLocale(lang), {
        weekday: "long",
        day: "numeric",
        month: "long",
        ...(withYear && { year: "numeric" }),
      }).format(date),
    );
  } catch {
    return date.toLocaleDateString();
  }
};

/** "Bugun" / "Ertaga" / "Kecha" — boshqa kunlar uchun `null`. */
export const relativeDayLabel = (date: Date, lang: string) => {
  const diff = differenceInCalendarDays(date, new Date());
  if (Math.abs(diff) > 1) return null;
  try {
    return capitalize(
      new Intl.RelativeTimeFormat(toIntlLocale(lang), {
        numeric: "auto",
      }).format(diff, "day"),
    );
  } catch {
    return null;
  }
};
