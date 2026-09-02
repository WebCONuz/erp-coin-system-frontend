import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Gift } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ControlledSelect } from "@/components/controls";
import { PageLoading } from "@/components/loading";
import { EmptyState } from "@/features/students/components/ui";
import { TablePagination } from "@/components/shared/table";
import { getFileUrl } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { usePagination } from "@/hooks/usePagination";
import { useMyPurchases } from "../hooks";
import type { PurchaseStatus } from "../types";

const STATUS_OPTIONS: { value: PurchaseStatus; label: string }[] = [
  { value: "pending", label: "Kutilmoqda" },
  { value: "approved", label: "Tasdiqlangan" },
  { value: "delivered", label: "Topshirilgan" },
  { value: "rejected", label: "Rad etilgan" },
  { value: "cancelled", label: "Bekor qilingan" },
];

const STATUS_BADGE_CLASS: Record<PurchaseStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

export const PurchaseHistoryTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const form = useForm<{ status: string }>({
    defaultValues: { status: searchParams.get("purchaseStatus") || "" },
  });
  const status = form.watch("status");

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (status) next.set("purchaseStatus", status);
    else next.delete("purchaseStatus");
    next.delete("page");
    setSearchParams(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const { currentPage, setPage } = usePagination();

  const { data, isLoading } = useMyPurchases({
    status: status || undefined,
    page: String(currentPage),
    limit: "10",
  });

  const purchases = data?.data ?? [];

  return (
    <div className="space-y-4">
      <Form {...form}>
        <ControlledSelect
          control={form.control}
          name="status"
          placeholder="Barcha holatlar"
          options={STATUS_OPTIONS}
          className="w-56"
        />
      </Form>

      {isLoading ? (
        <PageLoading />
      ) : !purchases.length ? (
        <EmptyState
          icon={<Gift size={20} />}
          title="Xaridlar mavjud emas"
          text="Hozircha hech qanday sovg'a sotib olinmagan."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0 overflow-hidden">
                  {purchase.reward.imageUrl ? (
                    <img
                      src={getFileUrl(purchase.reward.imageUrl)}
                      alt={purchase.reward.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Gift size={18} className="text-pink-600 dark:text-pink-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {purchase.reward.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{purchase.coinSpent} coin</span>
                    <span>·</span>
                    <span>{formatDate(purchase.purchasedAt, "dd.MM.yyyy")}</span>
                  </div>
                  <Badge
                    className={`mt-1 text-[10px] border-0 ${STATUS_BADGE_CLASS[purchase.status]}`}
                  >
                    {STATUS_OPTIONS.find((s) => s.value === purchase.status)
                      ?.label ?? purchase.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <TablePagination
              totalItems={data.total}
              currentPage={data.page}
              totalPages={data.totalPages}
              pageSize={data.limit}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};
