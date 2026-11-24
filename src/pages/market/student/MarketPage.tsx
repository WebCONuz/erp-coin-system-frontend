import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  StudentMarketHero,
  StudentEarnTips,
  StudentCategorySidebar,
  StudentProductGrid,
} from "@/features/market/components";
import {
  StudentPurchaseHistory,
  StudentPurchaseStatusFilter,
} from "@/features/purchases/components";
import { useRewardsCatalog } from "@/features/market/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardTitle } from "@/components/shared/title";
import { useAuth } from "@/features/auth/hooks/useLogin";

const SHOP_TAB = "shop";
const PURCHASES_TAB = "purchases";

const StudentMarketPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: catalog, isLoading } = useRewardsCatalog();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab URL'da — dashboard/profil/xarid modalidan to'g'ridan-to'g'ri
  // "Xaridlarim"ga olib kelish mumkin bo'lsin.
  const activeTab =
    searchParams.get("tab") === PURCHASES_TAB ? PURCHASES_TAB : SHOP_TAB;

  const setActiveTab = (value: string) => {
    const next = new URLSearchParams();
    if (value === PURCHASES_TAB) next.set("tab", PURCHASES_TAB);
    setSearchParams(next);
  };

  const rewards = catalog?.data ?? [];
  const balance = user?.wallet?.balance ?? 0;

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4 sm:space-y-5"
    >
      <div className="flex flex-col gap-3">
        <DashboardTitle
          title={t("market.student.title")}
          description={t("market.student.subtitle")}
        />

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
            <TabsTrigger
              value={SHOP_TAB}
              className="h-8 flex-none rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft"
            >
              {t("market.student.shopTab")}
            </TabsTrigger>
            <TabsTrigger
              value={PURCHASES_TAB}
              className="h-8 flex-none rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft"
            >
              {t("market.student.purchasesTab")}
            </TabsTrigger>
          </TabsList>

          {activeTab === PURCHASES_TAB && <StudentPurchaseStatusFilter />}
        </div>
      </div>

      <TabsContent value={SHOP_TAB} className="mt-0 space-y-4 sm:space-y-5">
        {isLoading ? (
          <div aria-busy="true" className="space-y-4">
            <Skeleton className="h-40 rounded-3xl" />
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-3/4 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <StudentMarketHero rewards={rewards} balance={balance} />
            <StudentEarnTips />

            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-5">
              <div className="min-w-0 lg:sticky lg:top-0">
                <StudentCategorySidebar totalCount={rewards.length} />
              </div>
              <div className="min-w-0">
                <StudentProductGrid
                  rewards={rewards}
                  onGoToPurchases={() => setActiveTab(PURCHASES_TAB)}
                />
              </div>
            </div>
          </>
        )}
      </TabsContent>

      <TabsContent value={PURCHASES_TAB} className="mt-0">
        <StudentPurchaseHistory />
      </TabsContent>
    </Tabs>
  );
};

export default StudentMarketPage;
