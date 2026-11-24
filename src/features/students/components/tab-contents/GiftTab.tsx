import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Gift, MessageSquareText } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/shared/table";
import { CoinAmount } from "@/components/shared/coin";
import { formatDate } from "@/ustils";
import {
  PurchaseActions,
  PurchaseStatusBadge,
  PurchaseStatusModal,
  RewardThumb,
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
        <h3 className="font-heading text-base font-semibold">
          {t("students.giftTab.title", { count: data?.total ?? 0 })}
        </h3>

        {isLoading ? (
          <div
            aria-busy="true"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : !purchases.length ? (
          <EmptyState
            icon={<Gift size={20} />}
            title={t("students.giftTab.emptyTitle")}
            text={t("students.giftTab.emptyText", {
              name: student?.fullName?.split(" ")[0],
            })}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {purchases.map((purchase) => (
              <li
                key={purchase.id}
                className="flex flex-col gap-3 rounded-2xl border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <RewardThumb imageUrl={purchase.reward.imageUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {purchase.reward.title}
                    </p>
                    <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                      {formatDate(purchase.purchasedAt, "dd.MM.yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <CoinAmount
                    value={purchase.coinSpent}
                    variant="pill"
                    size="sm"
                  />
                  <PurchaseStatusBadge status={purchase.status} />
                </div>

                {purchase.deliveryNote && (
                  <p className="flex gap-1.5 text-sm text-muted-foreground">
                    <MessageSquareText
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden
                    />
                    <span className="min-w-0 wrap-break-word">
                      {purchase.deliveryNote}
                    </span>
                  </p>
                )}

                {purchase.deliveredAt && (
                  <p className="text-xs text-muted-foreground">
                    {t("students.giftTab.deliveredAt", {
                      date: formatDate(purchase.deliveredAt, "dd.MM.yyyy"),
                      name: purchase.deliveredBy?.fullName ?? "",
                    })}
                  </p>
                )}

                <div className="mt-auto">
                  <PurchaseActions
                    purchase={purchase}
                    onAction={(p, status) => setAction({ purchase: p, status })}
                  />
                </div>
              </li>
            ))}
          </ul>
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
