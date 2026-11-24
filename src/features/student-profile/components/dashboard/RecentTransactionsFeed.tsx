import { Coins, Minus, Plus, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/states";
import { CoinAmount } from "@/components/shared/coin";
import { formatDate } from "@/ustils";
import { cn } from "@/lib/utils";
import { getCoinTxState } from "@/types";
import type { DashboardTransaction } from "../../types";

/** O'quvchining so'nggi tanga harakatlari. */
export const RecentTransactionsFeed = ({
  transactions,
}: {
  transactions: DashboardTransaction[];
}) => {
  const { t } = useTranslation();

  return (
    <Panel title={t("studentProfile.dashboard.recentActivity")} className="h-full">
      {!transactions.length ? (
        <EmptyState
          size="sm"
          icon={Coins}
          title={t("studentProfile.dashboard.noActivity")}
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
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      state === "reversal"
                        ? "bg-muted text-muted-foreground"
                        : isEarn
                          ? "bg-success-soft text-success"
                          : "bg-destructive-soft text-destructive",
                    )}
                  >
                    {state === "reversal" ? (
                      <Undo2 className="size-3.5" />
                    ) : isEarn ? (
                      <Plus className="size-3.5" />
                    ) : (
                      <Minus className="size-3.5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      <span className="font-medium">
                        {t(`transactionSource.${tx.sourceType}`, {
                          defaultValue: t("transactionSource.other"),
                        })}
                      </span>
                      {tx.note ? `: ${tx.note}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
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
