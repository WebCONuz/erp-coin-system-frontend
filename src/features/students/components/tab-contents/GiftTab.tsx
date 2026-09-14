import { useTranslation } from "react-i18next";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../ui";
import { Coins, Gift } from "lucide-react";
import type { StudentDetailFull } from "../../types";
import { formatDate } from "@/ustils";
import { Badge } from "@/components/ui/badge";

export const GiftTab = ({ student }: { student?: StudentDetailFull }) => {
  const { t } = useTranslation();

  const statusLabels: Record<string, string> = {
    approved: t("students.giftTab.status.approved"),
    delivered: t("students.giftTab.status.delivered"),
    rejected: t("students.giftTab.status.rejected"),
    cancelled: t("students.giftTab.status.cancelled"),
    pending: t("students.giftTab.status.pending"),
  };

  return (
    <TabsContent value="gifts" className="mt-4">
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t("students.giftTab.title", {
            count: student?.purchases?.length ?? 0,
          })}
        </h3>
        {!student?.purchases?.length ? (
          <EmptyState
            icon={<Gift size={20} />}
            title={t("students.giftTab.emptyTitle")}
            text={t("students.giftTab.emptyText", {
              name: student?.fullName?.split(" ")[0],
            })}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {student?.purchases?.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0">
                  <Gift
                    size={18}
                    className="text-pink-600 dark:text-pink-400"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                    {purchase?.reward?.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Coins size={11} />
                      {purchase?.coinSpent} coin
                    </span>
                    <span>·</span>
                    <span>
                      {formatDate(purchase?.purchasedAt, "dd.MM.yyyy")}
                    </span>
                  </div>
                  <Badge
                    className={`mt-1 text-[10px] border-0 ${
                      purchase.status === "approved" ||
                      purchase.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : purchase.status === "rejected" ||
                            purchase.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {statusLabels[purchase.status] ?? purchase.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TabsContent>
  );
};
