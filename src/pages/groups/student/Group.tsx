import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div>
        <div className="mb-3">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Guruhlar
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Guruhlaringiz, dars jadvali va davomat tarixi
          </p>
        </div>

        <TabsList className="bg-white border border-ink/10 p-1 rounded-full h-auto flex-wrap gap-1">
          {TAB_OPTIONS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-forest data-[state=active]:text-paper"
            >
              {tab.label}
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
