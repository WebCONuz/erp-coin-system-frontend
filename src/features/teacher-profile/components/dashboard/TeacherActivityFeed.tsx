import { Coins, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/states";
import { CoinAmount } from "@/components/shared/coin";
import { UserAvatar } from "@/components/shared/avatar";
import { formatDate } from "@/ustils";
import { cn } from "@/lib/utils";
import { getCoinTxState } from "@/types";
import type { TeacherDashboardTransaction } from "../../types";

/** O'qituvchining so'nggi tanga harakatlari. */
export const TeacherActivityFeed = ({
  transactions,
}: {
  transactions: TeacherDashboardTransaction[];
}) => {
  const { t } = useTranslation();

  return (
    <Panel title={t("teacherProfile.dashboard.myActivity")} className="h-full">
      {!transactions.length ? (
        <EmptyState
          size="sm"
          icon={Coins}
          title={t("teacherProfile.dashboard.noActivity")}
        />
      ) : (
        <ul className="divide-y">
          {transactions.map((tx) => {
            // Teskari yozuv — kulrang "↩"; bekor qilingan — summasi chizilgan.
            const state = getCoinTxState(tx);
            const isEarn = tx.direction === "earn";
            return (
              <li
                key={tx.id}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar name={tx.student.fullName} className="size-8" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {tx.student.fullName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t(`transactionSource.${tx.sourceType}`, {
                        defaultValue: t("transactionSource.other"),
                      })}
                      {tx.note ? `: ${tx.note}` : ""}
                      {", "}
                      <span className="tabular-nums">
                        {formatDate(tx.createdAt, "dd.MM.yyyy")}
                      </span>
                      {state === "reversal" &&
                        ` (${t("coinHistory.reversalBadge")})`}
                      {state === "reversed" &&
                        tx.reversal &&
                        ` (${t("coinHistory.reversedBadge", {
                          date: formatDate(tx.reversal.createdAt, "dd.MM.yyyy"),
                        })})`}
                    </p>
                  </div>
                </div>
                {state === "reversal" ? (
                  <span className="flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums text-muted-foreground">
                    <Undo2 className="size-3.5" aria-hidden />
                    {tx.amount}
                  </span>
                ) : (
                  <CoinAmount
                    value={isEarn ? tx.amount : -tx.amount}
                    signed
                    className={cn(
                      "shrink-0",
                      isEarn ? "text-success" : "text-destructive",
                      state === "reversed" && "line-through opacity-60",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
};
