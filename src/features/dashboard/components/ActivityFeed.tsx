import { formatDistanceToNow, parseISO } from "date-fns";
import { uz } from "date-fns/locale";
import { Minus, Plus } from "lucide-react";
import { getFileUrl } from "@/lib/utils";
import type { AdminDashboardActivity, DashboardActivitySourceType } from "../types";

interface Props {
  activity?: AdminDashboardActivity[];
  isLoading?: boolean;
}

const SOURCE_LABELS: Record<DashboardActivitySourceType, string> = {
  attendance: "Davomat",
  homework: "Uy vazifasi",
  competition: "Musobaqa",
  manual: "Qo'lda",
  bonus: "Bonus",
  purchase: "Xarid",
};

export const ActivityFeed = ({ activity, isLoading }: Props) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">So'nggi faoliyat</h3>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : !activity?.length ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Hali faoliyat mavjud emas
        </p>
      ) : (
        <div className="space-y-1">
          {activity.map((item, idx) => {
            const isEarn = item.direction === "earn";
            const avatarUrl = getFileUrl(item.student.avatarUrl);

            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 py-2.5 ${
                  idx !== activity.length - 1
                    ? "border-b border-zinc-100 dark:border-zinc-800"
                    : ""
                }`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={item.student.fullName}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-700 text-xs font-semibold text-white">
                    {item.student.fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {item.student.fullName}
                    </p>
                    <span
                      className={`flex shrink-0 items-center gap-0.5 text-sm font-semibold ${
                        isEarn
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {isEarn ? <Plus size={12} /> : <Minus size={12} />}
                      {item.amount}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    <b className="font-medium">
                      {SOURCE_LABELS[item.sourceType] ?? item.sourceType}
                    </b>
                    {item.note ? `: ${item.note}` : ""}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                    {item.teacher ? `${item.teacher.fullName} · ` : ""}
                    {formatRelative(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const formatRelative = (date: string) => {
  try {
    return formatDistanceToNow(parseISO(date), {
      addSuffix: true,
      locale: uz,
    });
  } catch {
    return "";
  }
};
