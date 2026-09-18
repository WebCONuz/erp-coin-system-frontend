import { TabsContent } from "@/components/ui/tabs";
import { Coins, Minus, Plus } from "lucide-react";
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
        <h3 className="font-display text-sm font-semibold text-ink">
          Tanga tarixi
        </h3>
        <span className="text-xs text-ink-soft">So'nggi 20 ta</span>
      </div>

      {!transactions.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-ink/10 bg-white">
          <Coins size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">
            Tranzaksiyalar mavjud emas
          </p>
          <p className="text-xs text-ink-soft mt-1 max-w-xs">
            Coin qo'shilgach yoki ayirilgach, tarix shu yerda ko'rinadi.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden">
          {transactions.map((tx, idx) => (
            <div
              key={tx.id}
              className={`flex items-center justify-between px-4 py-3 ${
                idx !== transactions.length - 1 ? "border-b border-ink/8" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs ${
                    tx.direction === "earn"
                      ? "bg-forest/10 text-forest"
                      : "bg-bloom/10 text-bloom"
                  }`}
                >
                  {tx.direction === "earn" ? (
                    <Plus size={13} />
                  ) : (
                    <Minus size={13} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">
                    <b>{SOURCE_TYPE_LABELS[tx.sourceType] ?? "Qo'shimcha"}</b>
                    {tx.note ? ` — ${tx.note}` : ""}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {formatDate(tx.createdAt, "dd.MM.yyyy")}
                    {tx.teacher ? ` · ${tx.teacher.fullName}` : ""}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold shrink-0 ${
                  tx.direction === "earn" ? "text-forest" : "text-bloom"
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
