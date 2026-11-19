import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Coins, Minus, Plus, Undo2 } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { PageLoading } from "@/components/loading";
import { cn } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { getCoinTxState, type CoinReversalFields } from "@/types";

export interface CoinHistoryItem extends CoinReversalFields {
  id: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: string;
  note?: string | null;
  createdAt: string;
  teacher?: { id: string; fullName: string } | null;
}

interface Props {
  transactions: CoinHistoryItem[];
  isLoading?: boolean;
}

/**
 * Student (o'z tarixi — `/my-history`) va teacher (o'quvchi sahifasi) uchun
 * coin tarixi. Bekor qilingan yozuv o'chmaydi: ustidan chizilgan holda qoladi,
 * teskari yozuv esa kulrang "↩" belgisi bilan ko'rinadi.
 */
export const CoinHistoryTab = ({ transactions, isLoading }: Props) => {
  const { t } = useTranslation();
  const [highlightedPair, setHighlightedPair] = useState<string[]>([]);

  const togglePair = (tx: CoinHistoryItem) => {
    const pairId = tx.reversalOfId ?? tx.reversal?.id;
    if (!pairId) return;
    setHighlightedPair((prev) =>
      prev.includes(tx.id) ? [] : [tx.id, pairId],
    );
  };

  return (
    <TabsContent value="coins" className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink">
          {t("studentProfile.tabs.coins")}
        </h3>
        <span className="text-xs text-ink-soft">
          {t("students.coinTab.last20")}
        </span>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : !transactions.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-ink/10 bg-white">
          <Coins size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">
            {t("students.coinTab.noTransactions")}
          </p>
          <p className="text-xs text-ink-soft mt-1 max-w-xs">
            {t("students.coinTab.noTransactionsText")}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden divide-y divide-ink/8">
          {transactions.map((tx) => {
            const state = getCoinTxState(tx);
            const isEarn = tx.direction === "earn";
            const isLinked = state !== "normal";

            return (
              <div
                key={tx.id}
                onClick={isLinked ? () => togglePair(tx) : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3 transition-colors",
                  isLinked && "cursor-pointer",
                  state === "reversal" && "bg-paper-soft",
                  highlightedPair.includes(tx.id) &&
                    "bg-gold/10 ring-1 ring-inset ring-gold/40",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs",
                      state === "reversal"
                        ? "bg-ink/5 text-ink-soft"
                        : isEarn
                          ? "bg-forest/10 text-forest"
                          : "bg-bloom/10 text-bloom",
                    )}
                  >
                    {state === "reversal" ? (
                      <Undo2 size={13} />
                    ) : isEarn ? (
                      <Plus size={13} />
                    ) : (
                      <Minus size={13} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm",
                        state === "reversal" ? "text-ink-soft" : "text-ink",
                      )}
                    >
                      {/* Bekor qilingan xarid uchun qaytarilgan coin ham `purchase` (earn) bilan keladi. */}
                      <b>
                        {t(`transactionSource.${tx.sourceType}`, {
                          defaultValue: t("transactionSource.other"),
                        })}
                      </b>
                      {tx.note ? ` — ${tx.note}` : ""}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-soft">
                      <span>
                        {formatDate(tx.createdAt, "dd.MM.yyyy")}
                        {tx.teacher ? ` · ${tx.teacher.fullName}` : ""}
                      </span>
                      {state === "reversal" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-1.5 py-0.5">
                          <Undo2 size={10} />
                          {t("coinHistory.reversalBadge")}
                        </span>
                      )}
                      {state === "reversed" && tx.reversal && (
                        <span className="rounded-full bg-bloom/10 px-1.5 py-0.5 text-bloom">
                          {t("coinHistory.reversedBadge", {
                            date: formatDate(tx.reversal.createdAt, "dd.MM.yyyy"),
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold shrink-0 tabular-nums",
                    state === "reversal"
                      ? "text-ink-soft"
                      : isEarn
                        ? "text-forest"
                        : "text-bloom",
                    state === "reversed" && "line-through opacity-60",
                  )}
                >
                  {isEarn ? "+" : "-"}
                  {tx.amount}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </TabsContent>
  );
};
