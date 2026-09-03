import { Coins, Minus, Plus } from "lucide-react";
import { formatDate } from "@/ustils";
import type { TeacherDashboardTransaction } from "../../types";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  homework: "Uyga vazifa",
  attendance: "Davomat",
  competition: "Musobaqa",
  bonus: "Bonus",
  manual: "Qo'lda berilgan",
  penalty: "Jarima",
};

export const TeacherActivityFeed = ({
  transactions,
}: {
  transactions: TeacherDashboardTransaction[];
}) => (
  <div className="rounded-2xl border border-ink/10 bg-white p-5">
    <h3 className="font-display text-sm font-semibold text-ink mb-4">
      So'nggi faoliyatim
    </h3>

    {!transactions.length ? (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Coins size={22} className="text-ink-soft/50 mb-2" />
        <p className="text-sm text-ink-soft">Harakatlar mavjud emas</p>
      </div>
    ) : (
      <div className="space-y-1">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between gap-3 px-1 py-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
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
              <div className="min-w-0">
                <p className="text-sm text-ink truncate">
                  <b>{tx.student.fullName}</b> —{" "}
                  {SOURCE_TYPE_LABELS[tx.sourceType] ?? "Qo'shimcha"}
                  {tx.note ? `: ${tx.note}` : ""}
                </p>
                <p className="text-xs text-ink-soft">
                  {formatDate(tx.createdAt, "dd.MM.yyyy")}
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
  </div>
);
