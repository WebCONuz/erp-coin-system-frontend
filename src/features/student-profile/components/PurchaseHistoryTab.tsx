import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, Gift } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { PageLoading } from "@/components/loading";
import { StudentPurchaseCard } from "@/features/purchases/components";
import { usePurchases } from "@/features/purchases/hooks";

const RECENT_LIMIT = 6;

// Profilda faqat oxirgi xaridlar; to'liq ro'yxat — do'kondagi "Xaridlarim" tabi.
export const PurchaseHistoryTab = () => {
  const { t } = useTranslation();
  const { data, isLoading } = usePurchases({ limit: String(RECENT_LIMIT) });
  const purchases = data?.data ?? [];

  return (
    <TabsContent value="gifts" className="mt-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          {t("purchases.student.profileTitle", { count: data?.total ?? 0 })}
        </h3>
        {!!data && data.total > RECENT_LIMIT && (
          <Link
            to="/student/market?tab=purchases"
            className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
          >
            {t("purchases.student.viewAll")}
            <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {isLoading ? (
        <PageLoading />
      ) : !purchases.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-border bg-card">
          <Gift size={22} className="text-muted-foreground/50 mb-2" />
          <p className="text-sm font-medium text-foreground">
            {t("purchases.student.empty")}
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            {t("purchases.student.emptyHint")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchases.map((purchase) => (
            <StudentPurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      )}
    </TabsContent>
  );
};
