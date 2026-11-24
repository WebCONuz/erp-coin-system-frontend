import { formatDistanceToNow, parseISO } from "date-fns";
import { ru, uz, uzCyrl } from "date-fns/locale";
import { History, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/shared/panel";
import { CoinAmount } from "@/components/shared/coin";
import { EmptyState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { getCoinTxState } from "@/types";
import { UserAvatar } from "@/components/shared/avatar";
import type {
  AdminDashboardActivity,
  DashboardActivitySourceType,
} from "../types";

interface Props {
  activity?: AdminDashboardActivity[];
  isLoading?: boolean;
}

const DATE_LOCALES = { ru, uz, uz_cr: uzCyrl } as const;

export const ActivityFeed = ({ activity, isLoading }: Props) => {
  const { t, i18n } = useTranslation();

  const sourceLabels: Record<DashboardActivitySourceType, string> = {
    attendance: t("admin.dashboard.activity.sourceTypes.attendance"),
    homework: t("admin.dashboard.activity.sourceTypes.homework"),
    competition: t("admin.dashboard.activity.sourceTypes.competition"),
    exam: t("admin.dashboard.activity.sourceTypes.exam"),
    manual: t("admin.dashboard.activity.sourceTypes.manual"),
    bonus: t("admin.dashboard.activity.sourceTypes.bonus"),
    purchase: t("admin.dashboard.activity.sourceTypes.purchase"),
  };

  const formatRelative = (date: string) => {
    try {
      return formatDistanceToNow(parseISO(date), {
        addSuffix: true,
        locale:
          DATE_LOCALES[i18n.language as keyof typeof DATE_LOCALES] ?? uz,
      });
    } catch {
      return "";
    }
  };

  return (
    <Panel title={t("admin.dashboard.activity.title")} flush>
      {isLoading ? (
        <div
          aria-busy="true"
          className="grid gap-2 px-4 pb-4 sm:px-5 sm:pb-5 md:grid-cols-2"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !activity?.length ? (
        <EmptyState
          size="sm"
          icon={History}
          title={t("admin.dashboard.activity.empty")}
        />
      ) : (
        <ul className="grid px-4 pb-2 sm:px-5 md:grid-cols-2 md:gap-x-8">
          {activity.map((item) => {
            const isEarn = item.direction === "earn";
            // Teskari yozuv — kulrang "↩"; bekor qilingan — summasi chizilgan.
            const state = getCoinTxState(item);

            return (
              <li
                key={item.id}
                className="flex items-start gap-3 border-b py-3 last:border-0 md:[&:nth-last-child(2):nth-child(odd)]:border-0"
              >
                <UserAvatar
                  name={item.student.fullName}
                  url={item.student.avatarUrl}
                  className="size-8"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">
                      {item.student.fullName}
                    </p>
                    {state === "reversal" ? (
                      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums text-muted-foreground">
                        <Undo2 className="size-3.5" aria-hidden />
                        {item.amount}
                      </span>
                    ) : (
                      <CoinAmount
                        value={isEarn ? item.amount : -item.amount}
                        signed
                        size="md"
                        className={cn(
                          isEarn ? "text-success" : "text-destructive",
                          state === "reversed" && "line-through opacity-60",
                        )}
                      />
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/80">
                      {sourceLabels[item.sourceType] ?? item.sourceType}
                    </span>
                    {item.note ? `: ${item.note}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.teacher ? `${item.teacher.fullName}, ` : ""}
                    {formatRelative(item.createdAt)}
                    {state === "reversal" &&
                      ` (${t("coinHistory.reversalBadge")})`}
                    {state === "reversed" &&
                      item.reversal &&
                      ` (${t("coinHistory.reversedBadge", {
                        date: formatDate(item.reversal.createdAt, "dd.MM.yyyy"),
                      })})`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
};
