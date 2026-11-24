import { useMemo } from "react";
import { parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLongDate, relativeDayLabel } from "@/ustils";
import type { SessionItem } from "../types";
import { SessionListCard } from "./SessionListCard";

interface Props {
  sessions: SessionItem[];
  onDelete?: (session: SessionItem) => void;
  hasAction?: boolean;
  hideTeacher?: boolean;
  hideGroup?: boolean;
  basePath?: string;
}

const GRID =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

/**
 * Sessiyalar kun bo'yicha guruhlanadi: sana har kartada takrorlanmaydi,
 * kun sarlavhasida bir marta yoziladi. Tartib backenddan kelganicha qoladi.
 */
export const SessionsGrid = ({ sessions, ...cardProps }: Props) => {
  const { i18n } = useTranslation();

  const days = useMemo(() => {
    const map = new Map<string, SessionItem[]>();
    for (const s of sessions) {
      const key = s.sessionDate.slice(0, 10);
      const list = map.get(key);
      if (list) list.push(s);
      else map.set(key, [s]);
    }
    return [...map.entries()];
  }, [sessions]);

  return (
    <div className="space-y-6">
      {days.map(([day, items]) => {
        const date = parseISO(day);
        const relative = relativeDayLabel(date, i18n.language);
        const headingId = `sessions-day-${day}`;

        return (
          <section key={day} aria-labelledby={headingId} className="space-y-3">
            <h2
              id={headingId}
              className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground"
            >
              {formatLongDate(date, i18n.language)}
              {relative && (
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                  {relative}
                </span>
              )}
            </h2>
            <ul className={GRID}>
              {items.map((item) => (
                <li key={item.id}>
                  <SessionListCard data={item} {...cardProps} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

/** Ro'yxat yuklanayotganda — haqiqiy kartalar shaklidagi skeleton. */
export const SessionsGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div aria-busy="true" className="space-y-3">
    <Skeleton className="h-5 w-48" />
    <div className={GRID}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-44 rounded-2xl" />
      ))}
    </div>
  </div>
);
