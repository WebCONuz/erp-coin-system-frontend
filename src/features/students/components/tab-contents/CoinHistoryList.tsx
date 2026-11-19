import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Coins, Minus, Plus, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/shared/modal";
import { PageLoading } from "@/components/loading";
import { cn } from "@/lib/utils";
import { formatDate, translateApiError } from "@/ustils";
import { canCancelCoinTx, getCoinTxState } from "@/types";
import { EmptyState } from "../ui";
import {
  useCancelCoinTransaction,
  useCoinTransactionHistory,
} from "../../hooks";
import type { CoinTransaction } from "../../types";

const PAGE_SIZE = 20;

interface Props {
  studentId: string;
  /** Arxivlangan o'quvchida bekor qilish tugmasi ko'rsatilmaydi. */
  canCancel: boolean;
}

/**
 * Admin uchun o'quvchining coin tarixi (`GET /coin-transactions/history`).
 * Bekor qilingan yozuv tarixda qoladi, ustiga teskari yozuv qo'shiladi —
 * ikkalasi vizual bog'langan (bittasiga bosilsa juftligi ajralib turadi).
 */
export const CoinHistoryList = ({ studentId, canCancel }: Props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [highlightedPair, setHighlightedPair] = useState<string[]>([]);
  const [pendingCancel, setPendingCancel] = useState<CoinTransaction | null>(
    null,
  );

  const { data, isLoading, isError } = useCoinTransactionHistory({
    studentId,
    page: String(page),
    limit: String(PAGE_SIZE),
  });
  const cancelTx = useCancelCoinTransaction(studentId);

  const transactions = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const getSourceLabel = (sourceType: string) =>
    t(`sourceTypes.${sourceType}`, {
      defaultValue: t("students.coinTab.sourceLabels.other"),
    });

  const togglePair = (tx: CoinTransaction) => {
    const pairId = tx.reversalOfId ?? tx.reversal?.id;
    if (!pairId) return setHighlightedPair([]);
    setHighlightedPair((prev) =>
      prev.includes(tx.id) ? [] : [tx.id, pairId],
    );
  };

  const confirmCancel = () => {
    if (!pendingCancel) return;
    cancelTx.mutate(pendingCancel.id, {
      onSuccess: (res) => {
        toast.success(
          t("students.coinTab.cancelSuccess", { balance: res.newBalance }),
        );
        setPendingCancel(null);
      },
      onError: (error) => {
        toast.error(translateApiError(error, t));
        setPendingCancel(null);
      },
    });
  };

  return (
    <div className="space-y-2 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {t("students.coinTab.historyTitle")}
        </p>
        {data?.total ? (
          <span className="text-xs text-zinc-400">
            {t("students.coinTab.totalCount", { count: data.total })}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <PageLoading />
      ) : isError ? (
        <p className="py-6 text-center text-sm text-red-600 dark:text-red-400">
          {t("common.error")}
        </p>
      ) : !transactions.length ? (
        <EmptyState
          icon={<Coins size={20} />}
          title={t("students.coinTab.noTransactions")}
          text={t("students.coinTab.noTransactionsText")}
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
          {transactions.map((tx) => {
            const state = getCoinTxState(tx);
            const isEarn = tx.direction === "earn";
            const isHighlighted = highlightedPair.includes(tx.id);
            const isLinked = state !== "normal";

            return (
              <div
                key={tx.id}
                onClick={isLinked ? () => togglePair(tx) : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-zinc-900 transition-colors",
                  isLinked && "cursor-pointer",
                  state === "reversal" && "bg-zinc-50 dark:bg-zinc-900/60",
                  isHighlighted &&
                    "bg-amber-50 dark:bg-amber-950/30 ring-1 ring-inset ring-amber-300 dark:ring-amber-800",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs",
                      state === "reversal"
                        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                        : isEarn
                          ? "bg-green-100 dark:bg-green-900/40 text-green-600"
                          : "bg-red-100 dark:bg-red-900/40 text-red-600",
                    )}
                  >
                    {state === "reversal" ? (
                      <Undo2 size={12} />
                    ) : isEarn ? (
                      <Plus size={12} />
                    ) : (
                      <Minus size={12} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm truncate",
                        state === "reversal"
                          ? "text-zinc-500 dark:text-zinc-400"
                          : "text-zinc-700 dark:text-zinc-300",
                      )}
                    >
                      <b>{getSourceLabel(tx.sourceType)}</b>
                      {tx.note ? `: ${tx.note}` : ""}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-400">
                      <span>{formatDate(tx.createdAt, "dd.MM.yyyy HH:mm")}</span>
                      {tx.teacher && <span>· {tx.teacher.fullName}</span>}
                      {state === "reversal" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 text-zinc-600 dark:text-zinc-300">
                          <Undo2 size={10} />
                          {t("coinHistory.reversalBadge")}
                        </span>
                      )}
                      {state === "reversed" && tx.reversal && (
                        <span className="rounded-full bg-red-100 dark:bg-red-950/50 px-1.5 py-0.5 text-red-700 dark:text-red-400">
                          {t("coinHistory.reversedBadge", {
                            date: formatDate(tx.reversal.createdAt, "dd.MM.yyyy"),
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      state === "reversal"
                        ? "text-zinc-500 dark:text-zinc-400"
                        : isEarn
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400",
                      state === "reversed" && "line-through opacity-60",
                    )}
                  >
                    {isEarn ? "+" : "-"}
                    {tx.amount}
                  </span>
                  {canCancel && canCancelCoinTx(tx) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingCancel(tx);
                      }}
                    >
                      {t("coinHistory.cancelAction")}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label={t("common.previous")}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs text-zinc-500 tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            aria-label={t("common.next")}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      <ConfirmModal
        open={!!pendingCancel}
        onClose={() => setPendingCancel(null)}
        onConfirm={confirmCancel}
        isPending={cancelTx.isPending}
        variant="warning"
        title={t("coinHistory.cancelConfirmTitle")}
        description={
          pendingCancel
            ? t("coinHistory.cancelConfirmDescription", {
                amount: `${pendingCancel.direction === "earn" ? "+" : "-"}${pendingCancel.amount}`,
              })
            : ""
        }
        confirmLabel={t("coinHistory.cancelAction")}
      />
    </div>
  );
};
