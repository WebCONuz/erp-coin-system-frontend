import { Coins } from "lucide-react";
import { getFileUrl } from "@/lib/utils";
import type { AdminDashboardLeaderboardEntry } from "../types";

interface Props {
  leaderboard?: AdminDashboardLeaderboardEntry[];
  isLoading?: boolean;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export const Leaderboard = ({ leaderboard, isLoading }: Props) => {
  const top = (leaderboard ?? []).slice(0, 5);

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">Reyting</h3>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-11 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : !top.length ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Hali reyting mavjud emas
        </p>
      ) : (
        <div className="space-y-1">
          {top.map((entry, idx) => {
            const avatarUrl = getFileUrl(entry.student.avatarUrl);

            return (
              <div
                key={entry.student.id}
                className="flex items-center gap-3 rounded-xl px-1.5 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              >
                <span className="w-5 shrink-0 text-center text-sm">
                  {MEDALS[idx] ?? (
                    <span className="text-xs font-semibold text-muted-foreground">
                      {idx + 1}
                    </span>
                  )}
                </span>

                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={entry.student.fullName}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-700 text-xs font-semibold text-white">
                    {entry.student.fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {entry.student.fullName}
                </span>

                <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  <Coins size={13} />
                  {entry.balance}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
