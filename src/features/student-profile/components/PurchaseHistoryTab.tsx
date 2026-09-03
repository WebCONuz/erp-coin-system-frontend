import { TabsContent } from "@/components/ui/tabs";
import { Coins, Gift } from "lucide-react";
import type { StudentDetailFull } from "@/features/students/types";
import { formatDate } from "@/ustils";

const STATUS_LABELS: Record<string, string> = {
  approved: "Tasdiqlangan",
  delivered: "Topshirilgan",
  rejected: "Rad etilgan",
  cancelled: "Bekor qilingan",
  pending: "Kutilmoqda",
};

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-forest/10 text-forest",
  delivered: "bg-forest/10 text-forest",
  rejected: "bg-bloom/10 text-bloom",
  cancelled: "bg-bloom/10 text-bloom",
  pending: "bg-gold/15 text-gold",
};

interface Props {
  student?: StudentDetailFull;
}

export const PurchaseHistoryTab = ({ student }: Props) => {
  const purchases = student?.purchases ?? [];

  return (
    <TabsContent value="gifts" className="mt-4 space-y-4">
      <h3 className="font-display text-sm font-semibold text-ink">
        Sotib olingan sovg'alar ({purchases.length})
      </h3>

      {!purchases.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-ink/10 bg-white">
          <Gift size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">
            Hali hech qanday sovg'a sotib olinmagan
          </p>
          <p className="text-xs text-ink-soft mt-1 max-w-xs">
            Coinlaringizni sovg'alar do'konidan biror narsaga almashtirishingiz
            mumkin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="flex items-center gap-3 p-4 rounded-2xl border border-ink/10 bg-white"
            >
              <div className="w-10 h-10 rounded-lg bg-bloom/10 flex items-center justify-center shrink-0">
                <Gift size={18} className="text-bloom" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">
                  {purchase.reward?.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-ink-soft mt-0.5">
                  <span className="flex items-center gap-1">
                    <Coins size={11} />
                    {purchase.coinSpent} coin
                  </span>
                  <span>·</span>
                  <span>{formatDate(purchase.purchasedAt, "dd.MM.yyyy")}</span>
                </div>
                <span
                  className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    STATUS_STYLES[purchase.status] ?? "bg-paper-soft text-ink-soft"
                  }`}
                >
                  {STATUS_LABELS[purchase.status] ?? purchase.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
};
