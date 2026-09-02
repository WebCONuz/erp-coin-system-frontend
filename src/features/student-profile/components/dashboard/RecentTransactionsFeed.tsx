import { Coins, Minus, Plus } from "lucide-react";
import { EmptyState } from "@/features/students/components/ui";
import { formatDate } from "@/ustils";
import type { DashboardTransaction } from "../../types";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  homework: "Uyga vazifa",
  attendance: "Davomat",
  competition: "Musobaqa",
  bonus: "Bonus",
  manual: "Qo'lda berilgan",
  purchase: "Xarid",
};

export const RecentTransactionsFeed = ({
  transactions,
}: {
  transactions: DashboardTransaction[];
}) => (
  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
      So'nggi harakatlar
    </h3>

    {!transactions.length ? (
      <EmptyState
        icon={<Coins size={18} />}
        title="Harakatlar mavjud emas"
        text=""
      />
    ) : (
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between gap-3 px-1 py-1.5"
          >
            <div className="flex items-center gap-2.5 min-w-0">
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
                  <b>{SOURCE_TYPE_LABELS[tx.sourceType] ?? "Qo'shimcha"}</b>
                  {tx.note ? `: ${tx.note}` : ""}
                </p>
                <p className="text-xs text-zinc-400">
                  {formatDate(tx.createdAt, "dd.MM.yyyy")}
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
  </div>
);
