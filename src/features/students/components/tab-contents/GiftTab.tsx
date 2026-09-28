import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Coins, Gift, MessageSquareText } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { PageLoading } from "@/components/loading";
import { TablePagination } from "@/components/shared/table";
import { getFileUrl } from "@/lib/utils";
import { formatDate } from "@/ustils";
import {
  PurchaseActions,
  PurchaseStatusBadge,
  PurchaseStatusModal,
} from "@/features/purchases/components";
import { usePurchases } from "@/features/purchases/hooks";
import type {
  Purchase,
  PurchaseActionStatus,
} from "@/features/purchases/types";
import { EmptyState } from "../ui";
import type { StudentDetailFull } from "../../types";

const PAGE_SIZE = 9;

export const GiftTab = ({ student }: { student?: StudentDetailFull }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<{
    purchase: Purchase;
    status: PurchaseActionStatus;
  } | null>(null);

  const { data, isLoading } = usePurchases(
    {
      studentId: student?.id,
      page: String(page),
      limit: String(PAGE_SIZE),
    },
    { enabled: !!student?.id },
  );
  const purchases = data?.data ?? [];

  return (
    <TabsContent value="gifts" className="mt-4">
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t("students.giftTab.title", { count: data?.total ?? 0 })}
        </h3>

        {isLoading ? (
          <PageLoading />
        ) : !purchases.length ? (
          <EmptyState
            icon={<Gift size={20} />}
            title={t("students.giftTab.emptyTitle")}
            text={t("students.giftTab.emptyText", {
              name: student?.fullName?.split(" ")[0],
            })}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex flex-col gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0 overflow-hidden">
                    {purchase.reward.imageUrl ? (
                      <img
                        src={getFileUrl(purchase.reward.imageUrl)}
                        alt={purchase.reward.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Gift
                        size={18}
                        className="text-pink-600 dark:text-pink-400"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                      {purchase.reward.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Coins size={11} />
                        {purchase.coinSpent} coin
                      </span>
                      <span>·</span>
                      <span>
                        {formatDate(purchase.purchasedAt, "dd.MM.yyyy")}
                      </span>
                    </div>
                  </div>
                  <PurchaseStatusBadge
                    status={purchase.status}
                    className="shrink-0 text-[10px]"
                  />
                </div>

                {purchase.deliveryNote && (
                  <p className="flex gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <MessageSquareText size={13} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 wrap-break-word">
                      {purchase.deliveryNote}
                    </span>
                  </p>
                )}

                {purchase.deliveredAt && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t("students.giftTab.deliveredAt", {
                      date: formatDate(purchase.deliveredAt, "dd.MM.yyyy"),
                      name: purchase.deliveredBy?.fullName ?? "",
                    })}
                  </p>
                )}

                <PurchaseActions
                  purchase={purchase}
                  onAction={(p, status) => setAction({ purchase: p, status })}
                />
              </div>
            ))}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <TablePagination
            totalItems={data.total}
            currentPage={page}
            totalPages={data.totalPages}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>

      <PurchaseStatusModal
        purchase={action?.purchase ?? null}
        status={action?.status ?? null}
        onClose={() => setAction(null)}
      />
    </TabsContent>
  );
};
