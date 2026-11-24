import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, LayoutGrid } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import {
  TeacherGroupsTab,
  TeacherCalendarTab,
} from "@/features/teacher-profile/components/groups";

const TAB_TRIGGER =
  "h-8 flex-none gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft";

const Group = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("groups");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4 sm:space-y-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <DashboardTitle
          title={t("teacherProfile.groups.title")}
          description={t("teacherProfile.groups.subtitle")}
        />
        <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
          <TabsTrigger value="groups" className={TAB_TRIGGER}>
            <LayoutGrid className="size-4" aria-hidden />
            {t("teacherProfile.groups.tabs.groups")}
          </TabsTrigger>
          <TabsTrigger value="calendar" className={TAB_TRIGGER}>
            <CalendarDays className="size-4" aria-hidden />
            {t("teacherProfile.groups.tabs.calendar")}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="groups" className="mt-0">
        <TeacherGroupsTab />
      </TabsContent>
      <TabsContent value="calendar" className="mt-0">
        <TeacherCalendarTab />
      </TabsContent>
    </Tabs>
  );
};

export default Group;
