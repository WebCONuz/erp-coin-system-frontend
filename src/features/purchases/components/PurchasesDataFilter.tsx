import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Gift, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import { useAdminDashboard } from "@/features/dashboard/hooks";
import { ALL_PURCHASES, useFilter } from "../hooks";
import { PURCHASE_STATUSES } from "../constants";
import type { PurchaseStatus } from "../types";

interface Props {
  // ?rewardId= bilan kelinganda chip'da ko'rsatiladigan sovg'a nomi.
  rewardTitle?: string;
}

export const PurchasesDataFilter = ({ rewardTitle }: Props) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const rewardId = searchParams.get("rewardId");
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

  const clearRewardFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("rewardId");
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="w-full space-y-4">
      <DashboardTitle
        title={t("admin.header.purchases")}
        description={t("purchases.description")}
      />

      <Tabs
        value={currentTab}
        onValueChange={(value) => form.setValue("status", value)}
        className="w-full"
      >
        {/* Mobilda tablar sig'masa — gorizontal scroll (sahifa emas) */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-8 flex-none gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft"
              >
                {tab.label}
                {!!tab.count && (
                  <span className="min-w-5 rounded-full bg-warning px-1.5 text-center text-[11px] font-semibold leading-5 text-background tabular-nums">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {rewardId && (
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border bg-card py-1 pr-1 pl-3 text-sm">
          <Gift size={14} className="shrink-0 text-muted-foreground" aria-hidden />
          <span className="truncate">
            {t("purchases.rewardFilter", {
              title: rewardTitle ?? t("purchases.rewardFilterFallback"),
            })}
          </span>
          <button
            type="button"
            onClick={clearRewardFilter}
            aria-label={t("common.clear")}
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={14} />
          </button>
        </span>
      )}
    </div>
  );
};
