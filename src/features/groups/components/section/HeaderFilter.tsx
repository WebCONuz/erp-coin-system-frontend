import { useTranslation } from "react-i18next";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { ControlledInput } from "@/components/controls";
import { DashboardTitle } from "@/components/shared/title";
import { TEXT_LIMITS } from "@/ustils/api-limits";
import { useFilter } from "../../hooks";

interface Props {
  handleCreate: () => void;
}

export const HeaderFilter = ({ handleCreate }: Props) => {
  const { form } = useFilter();
  const { t } = useTranslation();
  const currentTab = form.watch("status");

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <DashboardTitle title={t("admin.header.groups")} />
          <Button
            onClick={handleCreate}
            className="h-9 gap-2 px-3.5"
            aria-label={t("groups.btn.add")}
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t("groups.btn.add")}</span>
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Tabs
            value={currentTab || "all"}
            onValueChange={(value) =>
              form.setValue("status", value === "all" ? "" : value)
            }
          >
            <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
              {[
                { value: "all", label: t("common.all") },
                { value: "active", label: t("groups.tabs.active") },
                { value: "archive", label: t("groups.tabs.archive") },
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
              className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <ControlledInput
              control={form.control}
              placeholder={t("groups.search_placeholder")}
              name="search"
              maxLength={TEXT_LIMITS.SEARCH}
              inputClassName="h-9 pl-9"
            />
          </div>
        </div>
      </div>
    </Form>
  );
};
