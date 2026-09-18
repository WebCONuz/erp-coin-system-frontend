import { Award, Coins } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getFileUrl } from "@/lib/utils";
import type { AdminDashboardLeaderboardEntry } from "../types";

interface Props {
  leaderboard?: AdminDashboardLeaderboardEntry[];
  isLoading?: boolean;
}

const RANK_STYLES = [
  "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  "bg-zinc-200 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-300",
  "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
];

export const Leaderboard = ({ leaderboard, isLoading }: Props) => {
  const { t } = useTranslation();
  const top = (leaderboard ?? []).slice(0, 5);

  return (
    <Card className="h-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="flex-row items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Award size={16} />
        </div>
        <CardTitle>{t("admin.dashboard.leaderboard.title")}</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : !top.length ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {t("admin.dashboard.leaderboard.empty")}
          </p>
        ) : (
          <div className="space-y-1.5">
            {top.map((entry, idx) => {
              const avatarUrl = getFileUrl(entry.student.avatarUrl);

              return (
                <div
                  key={entry.student.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      RANK_STYLES[idx] ??
                        "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    )}
                  >
                    {idx + 1}
                  </span>

                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={entry.student.fullName}
                      className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-purple-700 text-xs font-semibold text-white">
                      {entry.student.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {entry.student.fullName}
                  </span>

                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Coins size={12} />
                    {entry.balance}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
