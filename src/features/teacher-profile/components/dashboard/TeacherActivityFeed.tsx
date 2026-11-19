import { Coins, Minus, Plus, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/ustils";
import { cn } from "@/lib/utils";
import { getCoinTxState } from "@/types";
import type { TeacherDashboardTransaction } from "../../types";

export const TeacherActivityFeed = ({
  transactions,
}: {
  transactions: TeacherDashboardTransaction[];
}) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <h3 className="font-display text-sm font-semibold text-ink mb-4">
        {t("teacherProfile.dashboard.myActivity")}
      </h3>

      {!transactions.length ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Coins size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm text-ink-soft">
            {t("teacherProfile.dashboard.noActivity")}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {transactions.map((tx) => {
            // Teskari yozuv — kulrang "↩"; bekor qilingan — summasi chizilgan.
            const state = getCoinTxState(tx);
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-3 px-1 py-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs",
                      state === "reversal"
                        ? "bg-ink/5 text-ink-soft"
                        : tx.direction === "earn"
                          ? "bg-forest/10 text-forest"
                          : "bg-bloom/10 text-bloom",
                    )}
                  >
                    {state === "reversal" ? (
                      <Undo2 size={13} />
                    ) : tx.direction === "earn" ? (
                      <Plus size={13} />
                    ) : (
                      <Minus size={13} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-ink truncate">
                      <b>{tx.student.fullName}</b> —{" "}
                      {t(`transactionSource.${tx.sourceType}`, {
                        defaultValue: t("transactionSource.other"),
                      })}
                      {tx.note ? `: ${tx.note}` : ""}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {formatDate(tx.createdAt, "dd.MM.yyyy")}
                      {state === "reversal" &&
                        ` · ${t("coinHistory.reversalBadge")}`}
                      {state === "reversed" &&
                        tx.reversal &&
                        ` · ${t("coinHistory.reversedBadge", {
                          date: formatDate(tx.reversal.createdAt, "dd.MM.yyyy"),
                        })}`}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold shrink-0",
                    state === "reversal"
                      ? "text-ink-soft"
                      : tx.direction === "earn"
                        ? "text-forest"
                        : "text-bloom",
                    state === "reversed" && "line-through opacity-60",
                  )}
                >
                  {tx.direction === "earn" ? "+" : "-"}
                  {tx.amount}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
