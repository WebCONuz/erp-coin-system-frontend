import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TeacherGroupsTab,
  TeacherCalendarTab,
} from "@/features/teacher-profile/components/groups";

const Group = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("groups");

  const tabOptions = [
    { value: "groups", label: t("teacherProfile.groups.tabs.groups") },
    { value: "calendar", label: t("teacherProfile.groups.tabs.calendar") },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div>
        <div className="mb-3">
          <h1 className="font-display text-2xl font-semibold text-ink">
            {t("teacherProfile.groups.title")}
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            {t("teacherProfile.groups.subtitle")}
          </p>
        </div>
        <TabsList className="bg-white border border-ink/10 p-1 rounded-full h-auto flex-wrap gap-1">
          {tabOptions.map((tab) => (
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
        <TeacherGroupsTab />
      </TabsContent>
      <TabsContent value="calendar" className="mt-0">
        <TeacherCalendarTab />
      </TabsContent>
    </Tabs>
  );
};

export default Group;
