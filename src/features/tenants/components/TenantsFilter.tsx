import { Search, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";

interface TenantFilterProps {
  onSearch: (value: string) => void;
  addTenant: () => void;
}

export const TenantDataFilter = ({
  onSearch,
  addTenant,
}: TenantFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-3 py-4">
      {/* 1-QATOR: Sarlavha va Harakat tugmalari */}
      <div className="flex items-center justify-between">
        <DashboardTitle title={t("admin.header.tenants")} />
        <div className="flex items-center gap-2">
          <Button
            onClick={addTenant}
            className="bg-linear-to-br from-purple-500 to-purple-700 text-white rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">{t("tenants.filter.add")}</span>
          </Button>
        </div>
      </div>

      {/* 2-QATOR: Filtrlash paneli */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tablar */}
        <Tabs
          defaultValue="active"
          className="bg-muted/50 p-1 rounded-lg border border-border"
        >
          <TabsList className="bg-transparent border-none gap-1 h-8">
            <TabsTrigger
              value="active"
              className="rounded-md px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
            >
              {t("tenants.filter.active")}
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="rounded-md px-4 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
            >
              {t("groups.tabs.archive")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Qidiruv */}
        <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500/20 transition-all shadow-sm">
          <div className="pl-3 text-muted-foreground/60">
            <Search size={18} />
          </div>
          <Input
            placeholder={t("common.search")}
            className="border-none focus-visible:ring-0 w-64 h-9 placeholder:text-muted-foreground/50 bg-transparent dark:bg-[#0A0A0A]"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
