import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import {
  MyGroupsTab,
  StudentCalendarTab,
  MyAttendanceTab,
} from "@/features/student-profile/components/groups";

const TAB_OPTIONS = [
  { value: "groups", label: "Guruhlarim" },
  { value: "calendar", label: "Dars jadvali" },
  { value: "attendance", label: "Davomat tarixi" },
];

const Group = () => {
  const [activeTab, setActiveTab] = useState("groups");

  return (
    <div className="space-y-6">
      <DashboardTitle title="Guruhlar" description="Guruhlaringiz, dars jadvali va davomat tarixi" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full h-auto flex-wrap gap-1">
          {TAB_OPTIONS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="groups" className="mt-4">
          <MyGroupsTab />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <StudentCalendarTab />
        </TabsContent>
        <TabsContent value="attendance" className="mt-4">
          <MyAttendanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Group;
