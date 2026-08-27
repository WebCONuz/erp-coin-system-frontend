import { TabsContent } from "@/components/ui/tabs";
import { Coins, Minus, Plus } from "lucide-react";
import { EmptyState } from "@/features/students/components/ui";
import type { StudentDetailFull } from "@/features/students/types";
import { formatDate } from "@/ustils";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  homework: "Uyga vazifa",
  attendance: "Davomat",
  bonus: "Bonus",
  manual: "Qo'lda berilgan",
};

interface Props {
  student?: StudentDetailFull;
}

export const CoinHistoryTab = ({ student }: Props) => {
  const transactions = student?.coinTransactionsReceived ?? [];

  return (
    <TabsContent value="coins" className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Tanga tarixi
        </h3>
        <span className="text-xs text-zinc-400">So'nggi 20 ta</span>
      </div>

      {!transactions.length ? (
        <EmptyState
          icon={<Coins size={20} />}
          title="Tranzaksiyalar mavjud emas"
          text="Coin qo'shilgach yoki ayirilgach, tarix shu yerda ko'rinadi."
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {transactions.map((tx, idx) => (
            <div
              key={tx.id}
              className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 ${
                idx !== transactions.length - 1
                  ? "border-b border-zinc-100 dark:border-zinc-800"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs ${
                    tx.direction === "earn"
                      ? "bg-green-100 dark:bg-green-900/40 text-green-600"
                      : "bg-red-100 dark:bg-red-900/40 text-red-600"
                  }`}
                >
                  {tx.direction === "earn" ? (
                    <Plus size={12} />
                  ) : (
                    <Minus size={12} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
                    <b>
                      {SOURCE_TYPE_LABELS[tx.sourceType] ?? "Qo'shimcha"}
                    </b>
                    {tx.note ? `: ${tx.note}` : ""}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {formatDate(tx.createdAt, "dd.MM.yyyy")}
                    {tx.teacher ? ` · ${tx.teacher.fullName}` : ""}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold shrink-0 ${
                  tx.direction === "earn"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {tx.direction === "earn" ? "+" : "-"}
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
};
