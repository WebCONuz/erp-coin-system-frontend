import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WeeklyKanban, MonthlyCalendar } from "@/features/plans/components";
import { updateSearchParams } from "@/ustils";

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

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-4">
      <TabsList className="h-10 rounded-lg border border-border bg-muted/50 p-1">
        <TabsTrigger
          value="kanban"
          className="rounded-md px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          {t("plans.tabs.kanban")}
        </TabsTrigger>
        <TabsTrigger
          value="calendar"
          className="rounded-md px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          {t("plans.tabs.calendar")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="kanban">
        <WeeklyKanban groupFilter={groupId} onGroupFilterChange={setGroupId} />
      </TabsContent>
      <TabsContent value="calendar">
        <MonthlyCalendar
          groupId={groupId}
          onGroupIdChange={setGroupId}
          month={month}
          onMonthChange={setMonth}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PlansPage;
