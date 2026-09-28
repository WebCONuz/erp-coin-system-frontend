import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Gift } from "lucide-react";
import { PageLoading } from "@/components/loading";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks/usePagination";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useRewardsCatalog } from "@/features/market/hooks";
import { getNearestGoal } from "@/features/market/lib/nearestGoal";
import { usePurchases } from "../../hooks";
import { StudentPurchaseCard } from "./StudentPurchaseCard";
import { PURCHASE_STATUS_PARAM } from "./StudentPurchaseStatusFilter";

export const StudentPurchaseHistory = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  // Status filtri market sahifasining sarlavhasida (StudentPurchaseStatusFilter).
  const status = searchParams.get(PURCHASE_STATUS_PARAM) ?? "";

  const { data, isLoading } = usePurchases({
    status: status || undefined,
    page: searchParams.get("page") || "1",
    limit: "12",
  });
  const { currentPage, setPage } = usePagination({
    initialPageSize: 12,
    totalItems: data?.total ?? 0,
  });
  const { data: catalog } = useRewardsCatalog();

  const purchases = data?.data ?? [];
  const balance = user?.wallet?.balance ?? 0;
  const nearestGoal = getNearestGoal(catalog?.data ?? [], balance);
  const coinsToGoal = nearestGoal
    ? Math.max(0, nearestGoal.coinPrice - balance)
    : null;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <PageLoading />
      ) : !purchases.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-ink/10 bg-white py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper-soft">
            <Gift size={20} className="text-ink-soft/60" />
          </div>
          <p className="text-sm font-medium text-ink">
            {status
              ? t("purchases.student.emptyFiltered")
              : t("purchases.student.empty")}
          </p>
          {!status && nearestGoal && coinsToGoal !== null && (
            <p className="mt-1 max-w-sm text-xs text-ink-soft">
              {t("purchases.student.emptyGoal", {
                title: nearestGoal.title,
                coins: coinsToGoal,
              })}
            </p>
          )}
          {!status && (
            <Link
              to="/student/market"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest-light"
            >
              {t("purchases.student.goToShop")}
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {purchases.map((purchase) => (
              <StudentPurchaseCard key={purchase.id} purchase={purchase} />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <TablePagination
              totalItems={data.total}
              currentPage={currentPage}
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
