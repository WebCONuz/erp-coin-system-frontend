import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { StatisticSection } from "@/features/students/components/partials";
import { GiftTab } from "@/features/students/components/tab-contents";
import {
  AttendanceHistoryTab,
  CoinHistoryTab,
  StudentProfileHeader,
} from "@/features/student-profile/components";
import { useMyProfile } from "@/features/student-profile/hooks";

const TAB_OPTIONS = [
  { value: "attendance", label: "Davomat tarixi" },
  { value: "coins", label: "Tanga tarixi" },
  { value: "gifts", label: "Xaridlar" },
];

const StudentProfilePage = () => {
  const { data: student, isLoading, isError } = useMyProfile();
  const [activeTab, setActiveTab] = useState("attendance");

  if (isLoading) return <PageLoading />;
  if (isError || !student) {
    return <NoData text="Profil ma'lumotlari topilmadi" />;
  }

  return (
    <div className="space-y-6">
      <StudentProfileHeader student={student} />

      <StatisticSection student={student} />

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

        <AttendanceHistoryTab student={student} />
        <CoinHistoryTab student={student} />
        <GiftTab student={student} />
      </Tabs>
    </div>
  );
};

export default StudentProfilePage;
