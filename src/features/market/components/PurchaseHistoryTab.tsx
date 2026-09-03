import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { Gift } from "lucide-react";
import { Form } from "@/components/ui/form";
import { ControlledSelect } from "@/components/controls";
import { PageLoading } from "@/components/loading";
import { TablePagination } from "@/components/shared/table";
import { getFileUrl } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { usePagination } from "@/hooks/usePagination";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useMyPurchases, useRewardsCatalog } from "../hooks";
import { getNearestGoal } from "../lib/nearestGoal";
import type { PurchaseStatus } from "../types";

const STATUS_OPTIONS: { value: PurchaseStatus; label: string }[] = [
  { value: "pending", label: "Kutilmoqda" },
  { value: "approved", label: "Tasdiqlangan" },
  { value: "delivered", label: "Topshirilgan" },
  { value: "rejected", label: "Rad etilgan" },
  { value: "cancelled", label: "Bekor qilingan" },
];

const STATUS_BADGE_CLASS: Record<PurchaseStatus, string> = {
  pending: "bg-gold/15 text-gold",
  approved: "bg-forest/10 text-forest",
  delivered: "bg-forest/10 text-forest",
  rejected: "bg-bloom/10 text-bloom",
  cancelled: "bg-bloom/10 text-bloom",
};

export const PurchaseHistoryTab = () => {
  const { user } = useAuth();
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
  const { data: catalog } = useRewardsCatalog();

  const purchases = data?.data ?? [];
  const nearestGoal = getNearestGoal(
    catalog?.data ?? [],
    user?.wallet?.balance ?? 0,
  );
  const coinsToGoal = nearestGoal
    ? Math.max(0, nearestGoal.coinPrice - (user?.wallet?.balance ?? 0))
    : null;

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
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-ink/10 bg-white">
          <div className="w-12 h-12 rounded-full bg-paper-soft flex items-center justify-center mb-3">
            <Gift size={20} className="text-ink-soft/60" />
          </div>
          <p className="text-sm font-medium text-ink">
            Hozircha hech qanday sovg'a sotib olinmagan
          </p>
          {nearestGoal && coinsToGoal !== null && (
            <p className="text-xs text-ink-soft mt-1 max-w-sm">
              {nearestGoal.title}'gacha bor-yo'g'i {coinsToGoal} coin qoldi —
              yana bir necha dars va uy vazifasi bilan yetib olasiz!
            </p>
          )}
          <Link
            to="/student/market"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-forest text-paper text-sm font-medium px-4 py-2.5 hover:bg-forest-light transition-colors"
          >
            Do'konga o'tish
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center gap-3 p-4 rounded-2xl border border-ink/10 bg-white"
              >
                <div className="w-10 h-10 rounded-lg bg-bloom/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {purchase.reward.imageUrl ? (
                    <img
                      src={getFileUrl(purchase.reward.imageUrl)}
                      alt={purchase.reward.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Gift size={18} className="text-bloom" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {purchase.reward.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-ink-soft mt-0.5">
                    <span>{purchase.coinSpent} coin</span>
                    <span>·</span>
                    <span>{formatDate(purchase.purchasedAt, "dd.MM.yyyy")}</span>
                  </div>
                  <span
                    className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE_CLASS[purchase.status]}`}
                  >
                    {STATUS_OPTIONS.find((s) => s.value === purchase.status)
                      ?.label ?? purchase.status}
                  </span>
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
