import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/shared/panel";
import { CoinAmount } from "@/components/shared/coin";
import { EmptyState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/avatar";
import type { AdminDashboardLeaderboardEntry } from "../types";

interface Props {
  leaderboard?: AdminDashboardLeaderboardEntry[];
  isLoading?: boolean;
}

export const Leaderboard = ({ leaderboard, isLoading }: Props) => {
  const { t } = useTranslation();
  const top = (leaderboard ?? []).slice(0, 5);

  return (
    <Panel
      title={t("admin.dashboard.leaderboard.title")}
      description={t("admin.dashboard.leaderboardHint")}
      className="h-full"
      flush
    >
      {isLoading ? (
        <div aria-busy="true" className="space-y-2 px-4 pb-4 sm:px-5 sm:pb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : !top.length ? (
        <EmptyState
          size="sm"
          icon={Trophy}
          title={t("admin.dashboard.leaderboard.empty")}
        />
      ) : (
        <ol className="px-2 pb-2 sm:px-3 sm:pb-3">
          {top.map((entry, idx) => (
            <li key={entry.student.id}>
              <Link
                to={`/admin/students/${entry.student.id}`}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span
                  className={cn(
                    "w-5 shrink-0 text-center font-heading text-sm font-semibold tabular-nums",
                    idx === 0 ? "text-coin-ink" : "text-muted-foreground",
                  )}
                >
                  {idx + 1}
                </span>
                <UserAvatar
                  name={entry.student.fullName}
                  url={entry.student.avatarUrl}
                  highlight={idx === 0}
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {entry.student.fullName}
                </span>
                <CoinAmount value={entry.balance} variant="pill" size="sm" />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
};
