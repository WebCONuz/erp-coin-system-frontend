import { useTranslation } from "react-i18next";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../ui";
import { Coins, Minus, Plus } from "lucide-react";
import type { StudentDetailFull } from "../../types";
import { formatDate } from "@/ustils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useManualCoinTransaction } from "../../hooks";
import { useParams } from "react-router-dom";

interface CoinFormState {
  amount: string;
  note: string;
}

const emptyCoinForm: CoinFormState = { amount: "", note: "" };

export const CoinTab = ({
  student,
  isDeleted,
}: {
  student?: StudentDetailFull;
  isDeleted: boolean;
}) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const manualCoin = useManualCoinTransaction(id ?? "");
  const [coinForms, setCoinForms] = useState<
    Record<"earn" | "deduct", CoinFormState>
  >({
    earn: emptyCoinForm,
    deduct: emptyCoinForm,
  });

  const handleCoinAction = (direction: "earn" | "deduct") => {
    const amount = Number(coinForms[direction].amount);
    if (!amount || amount < 1 || !id) return;
    manualCoin.mutate(
      {
        studentId: id,
        amount,
        direction,
        sourceType: "manual",
        note: coinForms[direction].note || undefined,
      },
      {
        onSuccess: () =>
          setCoinForms((p) => ({ ...p, [direction]: emptyCoinForm })),
      },
    );
  };

  return (
    <TabsContent value="coins" className="mt-4 space-y-4">
      <div className="flex items-center gap-4 p-5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20">
        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center">
          <Coins size={24} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide">
            {t("students.coinTab.currentBalance")}
          </p>
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
            {student?.wallet?.balance ?? 0}{" "}
            <span className="text-base font-normal">coin</span>
          </p>
        </div>
      </div>

      {!isDeleted && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(["earn", "deduct"] as const).map((dir) => {
            const isEarn = dir === "earn";
            return (
              <div key={dir} className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  {isEarn
                    ? t("students.coinTab.addCoin")
                    : t("students.coinTab.deductCoin")}
                </p>
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border ${isEarn ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30" : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30"}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isEarn ? "bg-green-100 dark:bg-green-900 text-green-600" : "bg-red-100 dark:bg-red-900 text-red-600"}`}
                  >
                    {isEarn ? <Plus size={16} /> : <Minus size={16} />}
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={coinForms[dir].amount}
                    onChange={(e) =>
                      setCoinForms((p) => ({
                        ...p,
                        [dir]: { ...p[dir], amount: e.target.value },
                      }))
                    }
                    placeholder={`${t("common.amount")}...`}
                    className="flex-1 bg-transparent border-0 outline-none text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 w-0"
                  />
                  <input
                    type="text"
                    value={coinForms[dir].note}
                    onChange={(e) =>
                      setCoinForms((p) => ({
                        ...p,
                        [dir]: { ...p[dir], note: e.target.value },
                      }))
                    }
                    placeholder={t("students.coinTab.reason")}
                    className="flex-1 bg-transparent border-0 outline-none text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 border-l border-zinc-200 dark:border-zinc-700 pl-3 w-0"
                  />
                  <Button
                    size="sm"
                    disabled={!coinForms[dir].amount || manualCoin.isPending}
                    className={
                      isEarn
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }
                    onClick={() => handleCoinAction(dir)}
                  >
                    {isEarn ? t("common.add") : t("students.coinTab.deduct")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t("students.coinTab.historyTitle")}
          </p>
          <span className="text-xs text-zinc-400">
            {t("students.coinTab.last20")}
          </span>
        </div>
        {!student?.coinTransactionsReceived?.length ? (
          <EmptyState
            icon={<Coins size={20} />}
            title={t("students.coinTab.noTransactions")}
            text={t("students.coinTab.noTransactionsText")}
          />
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {student?.coinTransactionsReceived?.map((tx, idx) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 ${idx !== (student?.coinTransactionsReceived?.length ?? 0) - 1 ? "border-b border-zinc-100 dark:border-zinc-800" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${tx?.direction === "earn" ? "bg-green-100 dark:bg-green-900/40 text-green-600" : "bg-red-100 dark:bg-red-900/40 text-red-600"}`}
                  >
                    {tx?.direction === "earn" ? (
                      <Plus size={12} />
                    ) : (
                      <Minus size={12} />
                    )}{" "}
                  </div>
                  <div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      <b>
                        {tx?.sourceType === "homework"
                          ? t("students.coinTab.sourceLabels.homework")
                          : tx?.sourceType === "attendance"
                            ? t("students.coinTab.sourceLabels.attendance")
                            : tx?.sourceType === "bonus"
                              ? t("students.coinTab.sourceLabels.bonus")
                              : t("students.coinTab.sourceLabels.other")}
                      </b>
                      {": "}
                      {tx?.note ?? "-"}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {formatDate(tx.createdAt, "dd.MM.yyyy")}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${tx.direction === "earn" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {tx.direction === "earn" ? "+" : "-"}
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </TabsContent>
  );
};
