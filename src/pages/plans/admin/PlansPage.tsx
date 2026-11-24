import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarDays, Columns3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import { WeeklyKanban, MonthlyCalendar } from "@/features/plans/components";
import { updateSearchParams } from "@/ustils";

const TAB_TRIGGER =
  "h-7 flex-none gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft";

const PlansPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "kanban";
  const groupId = searchParams.get("groupId") || "";
  const month = searchParams.get("month") || format(new Date(), "yyyy-MM");

  const setTab = (value: string) =>
    updateSearchParams("tab", value, searchParams, setSearchParams);

  const setGroupId = (value: string) =>
    updateSearchParams("groupId", value, searchParams, setSearchParams);

  const setMonth = (value: string) =>
    updateSearchParams("month", value, searchParams, setSearchParams);

  // Almashtirgich har bir ko'rinishning boshqaruv qatorida, guruh tanlash
  // yonida chiqadi — foydalanuvchi uni darhol topadi.
  const viewSwitcher = (
    <TabsList className="h-9 gap-0.5 rounded-lg border bg-card p-0.5">
      <TabsTrigger value="kanban" className={TAB_TRIGGER}>
        <Columns3 className="size-4" aria-hidden />
        {t("plans.tabs.kanban")}
      </TabsTrigger>
      <TabsTrigger value="calendar" className={TAB_TRIGGER}>
        <CalendarDays className="size-4" aria-hidden />
        {t("plans.tabs.calendar")}
      </TabsTrigger>
    </TabsList>
  );

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-4 sm:space-y-5">
      <DashboardTitle title={t("admin.header.plans")} />

      <TabsContent value="kanban" className="mt-0">
        <WeeklyKanban
          groupFilter={groupId}
          onGroupFilterChange={setGroupId}
          viewSwitcher={viewSwitcher}
        />
      </TabsContent>
      <TabsContent value="calendar" className="mt-0">
        <MonthlyCalendar
          groupId={groupId}
          onGroupIdChange={setGroupId}
          month={month}
          onMonthChange={setMonth}
          viewSwitcher={viewSwitcher}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PlansPage;
