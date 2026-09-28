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
import { PageLoading } from "@/components/loading";
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {t("market.student.title")}
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            {t("market.student.subtitle")}
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <TabsList className="bg-white border border-ink/10 p-1 rounded-full h-auto shrink-0 gap-1">
            <TabsTrigger
              value={SHOP_TAB}
              className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-forest data-[state=active]:text-paper"
            >
              {t("market.student.shopTab")}
            </TabsTrigger>
            <TabsTrigger
              value={PURCHASES_TAB}
              className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-forest data-[state=active]:text-paper"
            >
              {t("market.student.purchasesTab")}
            </TabsTrigger>
          </TabsList>

          {activeTab === PURCHASES_TAB && <StudentPurchaseStatusFilter />}
        </div>
      </div>

      <TabsContent value={SHOP_TAB} className="space-y-4 mt-0">
        {isLoading ? (
          <PageLoading />
        ) : (
          <>
            <StudentMarketHero rewards={rewards} balance={balance} />
            <StudentEarnTips />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <StudentCategorySidebar totalCount={rewards.length} />
              </div>
              <div className="lg:col-span-4">
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
