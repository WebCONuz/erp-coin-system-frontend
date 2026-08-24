import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WeeklyKanban, MonthlyCalendar } from "@/features/plans/components";

const PlansPage = () => {
  const [groupId, setGroupId] = useState("");

  return (
    <Tabs defaultValue="kanban" className="space-y-4">
      <TabsList className="h-10 rounded-lg border border-border bg-muted/50 p-1">
        <TabsTrigger
          value="kanban"
          className="rounded-md px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          Haftalik Shablon (Kanban)
        </TabsTrigger>
        <TabsTrigger
          value="calendar"
          className="rounded-md px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          Oylik Kalendar
        </TabsTrigger>
      </TabsList>

      <TabsContent value="kanban">
        <WeeklyKanban groupFilter={groupId} onGroupFilterChange={setGroupId} />
      </TabsContent>
      <TabsContent value="calendar">
        <MonthlyCalendar groupId={groupId} onGroupIdChange={setGroupId} />
      </TabsContent>
    </Tabs>
  );
};

export default PlansPage;
