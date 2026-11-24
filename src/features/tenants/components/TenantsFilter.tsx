import { Search, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import { TEXT_LIMITS } from "@/ustils";

export type TenantStatusFilter = "active" | "archive";

interface TenantFilterProps {
  status: TenantStatusFilter;
  onStatusChange: (status: TenantStatusFilter) => void;
  search: string;
  onSearch: (value: string) => void;
  addTenant: () => void;
}

export const TenantDataFilter = ({
  status,
  onStatusChange,
  search,
  onSearch,
  addTenant,
}: TenantFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3">
        <DashboardTitle title={t("admin.header.tenants")} />
        <Button
          onClick={addTenant}
          className="h-9 gap-2 px-3.5"
          aria-label={t("tenants.filter.add")}
        >
          <Plus className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t("tenants.filter.add")}</span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs
          value={status}
          onValueChange={(value) => onStatusChange(value as TenantStatusFilter)}
        >
          <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
            {[
              { value: "active", label: t("tenants.filter.active") },
              { value: "archive", label: t("tenants.filter.inactive") },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-8 flex-none rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div role="search" className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            placeholder={t("tenants.filter.searchPlaceholder")}
            aria-label={t("tenants.filter.searchPlaceholder")}
            maxLength={TEXT_LIMITS.SEARCH}
            className="h-9 pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
