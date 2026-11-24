import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Coins, Minus, Plus, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/shared/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CoinAmount } from "@/components/shared/coin";
import { ErrorState } from "@/components/shared/states";
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
    <div className="min-w-0 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-heading text-base font-semibold">
          {t("students.coinTab.historyTitle")}
        </h3>
        {data?.total ? (
          <span className="text-xs tabular-nums text-muted-foreground">
            {t("students.coinTab.totalCount", { count: data.total })}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <div aria-busy="true" className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState className="py-8" />
      ) : !transactions.length ? (
        <EmptyState
          icon={<Coins size={20} />}
          title={t("students.coinTab.noTransactions")}
          text={t("students.coinTab.noTransactionsText")}
        />
      ) : (
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
          {transactions.map((tx) => {
            const state = getCoinTxState(tx);
            const isEarn = tx.direction === "earn";
            const isHighlighted = highlightedPair.includes(tx.id);
            const isLinked = state !== "normal";

            return (
              <li
                key={tx.id}
                onClick={isLinked ? () => togglePair(tx) : undefined}
                onKeyDown={
                  isLinked
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          togglePair(tx);
                        }
                      }
                    : undefined
                }
                tabIndex={isLinked ? 0 : undefined}
                aria-pressed={isLinked ? isHighlighted : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3 transition-colors",
                  isLinked &&
                    "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                  state === "reversal" && "bg-muted/40",
                  isHighlighted && "bg-warning-soft ring-1 ring-inset ring-warning/40",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      state === "reversal"
                        ? "bg-muted text-muted-foreground"
                        : isEarn
                          ? "bg-success-soft text-success"
                          : "bg-destructive-soft text-destructive",
                    )}
                    aria-hidden
                  >
                    {state === "reversal" ? (
                      <Undo2 size={14} />
                    ) : isEarn ? (
                      <Plus size={14} />
                    ) : (
                      <Minus size={14} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "truncate text-sm",
                        state === "reversal" && "text-muted-foreground",
                      )}
                    >
                      <span className="font-medium">
                        {getSourceLabel(tx.sourceType)}
                      </span>
                      {tx.note ? `: ${tx.note}` : ""}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="tabular-nums">
                        {formatDate(tx.createdAt, "dd.MM.yyyy HH:mm")}
                      </span>
                      {tx.teacher && <span>{tx.teacher.fullName}</span>}
                      {state === "reversal" && (
                        <Badge variant="secondary" className="h-auto py-0">
                          <Undo2 aria-hidden />
                          {t("coinHistory.reversalBadge")}
                        </Badge>
                      )}
                      {state === "reversed" && tx.reversal && (
                        <Badge variant="danger" className="h-auto py-0">
                          {t("coinHistory.reversedBadge", {
                            date: formatDate(tx.reversal.createdAt, "dd.MM.yyyy"),
                          })}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {state === "reversal" ? (
                    <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                      {isEarn ? "+" : "−"}
                      {tx.amount}
                    </span>
                  ) : (
                    <CoinAmount
                      value={isEarn ? tx.amount : -tx.amount}
                      signed
                      className={cn(
                        isEarn ? "text-success" : "text-destructive",
                        state === "reversed" && "line-through opacity-60",
                      )}
                    />
                  )}
                  {canCancel && canCancelCoinTx(tx) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingCancel(tx);
                      }}
                    >
                      {t("coinHistory.cancelAction")}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label={t("common.previous")}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            aria-label={t("common.next")}
          >
            <ChevronRight className="size-4" aria-hidden />
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
