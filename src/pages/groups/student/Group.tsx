import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import {
  MyGroupsTab,
  StudentCalendarTab,
  MyAttendanceTab,
} from "@/features/student-profile/components/groups";

const TAB_OPTIONS = [
  { value: "groups", labelKey: "studentProfile.groups.tabs.groups" },
  { value: "calendar", labelKey: "studentProfile.groups.tabs.calendar" },
  { value: "attendance", labelKey: "studentProfile.tabs.attendance" },
];

const Group = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("groups");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <DashboardTitle
          title={t("admin.header.groups")}
          description={t("studentProfile.groups.pageSubtitle")}
        />

        <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
          {TAB_OPTIONS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-8 flex-none rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft"
            >
              {t(tab.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="groups" className="mt-0">
        <MyGroupsTab />
      </TabsContent>
      <TabsContent value="calendar" className="mt-0">
        <StudentCalendarTab />
      </TabsContent>
      <TabsContent value="attendance" className="mt-0">
        <MyAttendanceTab />
      </TabsContent>
    </Tabs>
  );
};

export default Group;
