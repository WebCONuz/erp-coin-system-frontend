import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import {
  AttendanceHistoryTabV2,
  CoinHistoryTab,
  PurchaseHistoryTab,
  ProfileStatsRow,
  StudentProfileHeader,
  GardenMapCard,
} from "@/features/student-profile/components";
import {
  useMyProfile,
  useStudentLevel,
} from "@/features/student-profile/hooks";

const TAB_OPTIONS = [
  { value: "attendance", label: "Davomat tarixi" },
  { value: "coins", label: "Tanga tarixi" },
  { value: "gifts", label: "Xaridlar" },
];

const StudentProfilePage = () => {
  const { data: student, isLoading, isError } = useMyProfile();
  const [activeTab, setActiveTab] = useState("attendance");
  const { progress } = useStudentLevel(student?.wallet?.balance ?? 0);

  if (isLoading) return <PageLoading />;
  if (isError || !student) {
    return <NoData text="Profil ma'lumotlari topilmadi" />;
  }

  return (
    <div className="space-y-4">
      <StudentProfileHeader student={student} />
      <ProfileStatsRow student={student} />
      <GardenMapCard progress={progress} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
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

        <AttendanceHistoryTabV2 student={student} />
        <CoinHistoryTab student={student} />
        <PurchaseHistoryTab student={student} />
      </Tabs>
    </div>
  );
};

export default StudentProfilePage;
