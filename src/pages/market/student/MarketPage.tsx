import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  PurchaseHistoryTab,
  StudentMarketHero,
  StudentEarnTips,
  StudentCategorySidebar,
  StudentProductGrid,
} from "@/features/market/components";
import { useRewardsCatalog } from "@/features/market/hooks";
import { PageLoading } from "@/components/loading";
import { useAuth } from "@/features/auth/hooks/useLogin";

const StudentMarketPage = () => {
  const { user } = useAuth();
  const { data: catalog, isLoading } = useRewardsCatalog();
  const [activeTab, setActiveTab] = useState("shop");

  const rewards = catalog?.data ?? [];
  const balance = user?.wallet?.balance ?? 0;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Sovg'alar do'koni
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Tanga to'plang, o'zingizga yoqqan sovg'ani tanlang
          </p>
        </div>

        <TabsList className="bg-white border border-ink/10 p-1 rounded-full h-auto flex-wrap gap-1">
          <TabsTrigger
            value="shop"
            className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-forest data-[state=active]:text-paper"
          >
            Do'kon
          </TabsTrigger>
          <TabsTrigger
            value="purchases"
            className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-forest data-[state=active]:text-paper"
          >
            Xaridlarim
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="shop" className="space-y-4 mt-0">
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
                <StudentProductGrid rewards={rewards} />
              </div>
            </div>
          </>
        )}
      </TabsContent>

      <TabsContent value="purchases" className="mt-0">
        <PurchaseHistoryTab />
      </TabsContent>
    </Tabs>
  );
};

export default StudentMarketPage;
