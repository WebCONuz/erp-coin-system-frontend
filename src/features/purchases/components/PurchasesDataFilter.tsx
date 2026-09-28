import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import { useAdminDashboard } from "@/features/dashboard/hooks";
import { ALL_PURCHASES, useFilter } from "../hooks";
import { PURCHASE_STATUSES } from "../constants";
import type { PurchaseStatus } from "../types";

export const PurchasesDataFilter = () => {
  const { t } = useTranslation();
  const { form } = useFilter();
  const currentTab = form.watch("status");
  const { data: dashboard } = useAdminDashboard();

  const counts: Partial<Record<PurchaseStatus, number>> = {
    pending: dashboard?.needsAttention?.pendingPurchases,
    approved: dashboard?.needsAttention?.approvedPurchases,
  };

  const tabs = [
    { value: ALL_PURCHASES, label: t("purchases.tabs.all"), count: undefined },
    ...PURCHASE_STATUSES.map((status) => ({
      value: status,
      label: t(`purchases.tabs.${status}`),
      count: counts[status],
    })),
  ];

  return (
    <div className="w-full space-y-3 py-4">
      <DashboardTitle
        title={t("admin.header.purchases")}
        description={t("purchases.description")}
      />

      <Tabs
        value={currentTab}
        onValueChange={(value) => form.setValue("status", value)}
        className="w-full"
      >
        <div className="max-w-full overflow-x-auto">
          <TabsList className="h-auto gap-1 rounded-lg border border-border bg-muted/50 p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                {tab.label}
                {!!tab.count && (
                  <span className="min-w-5 rounded-full bg-red-500 px-1.5 text-[11px] leading-5 text-white">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};
