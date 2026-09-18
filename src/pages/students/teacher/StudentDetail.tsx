import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { BackListButton } from "@/components/shared/back";
import { useStudentById } from "@/features/students/hooks";
import { useMyTaughtGroups } from "@/features/teacher-profile/hooks";
import {
  TeacherStudentHeader,
  GiveCoinModal,
} from "@/features/teacher-profile/components/students";
import {
  AttendanceHistoryTabV2,
  CoinHistoryTab,
  PurchaseHistoryTab,
  ProfileStatsRow,
} from "@/features/student-profile/components";

const TAB_OPTIONS = [
  { value: "attendance", label: "Davomat tarixi" },
  { value: "coins", label: "Tanga tarixi" },
  { value: "gifts", label: "Xaridlar" },
];

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading, isError } = useStudentById(id ?? "");
  const { data: myGroups } = useMyTaughtGroups();
  const [activeTab, setActiveTab] = useState("attendance");
  const [coinModalOpen, setCoinModalOpen] = useState(false);

  const myGroupIds = new Set((myGroups ?? []).map((g) => g.id));

  return (
    <div className="space-y-4">
      <BackListButton title="O'quvchilarim" />

      {isLoading ? (
        <PageLoading />
      ) : isError || !student ? (
        <NoData text="O'quvchi ma'lumotlari topilmadi" />
      ) : (
        <>
          <TeacherStudentHeader
            student={student}
            myGroupIds={myGroupIds}
            onGiveCoin={() => setCoinModalOpen(true)}
          />

          <ProfileStatsRow student={student} />

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

          <GiveCoinModal
            open={coinModalOpen}
            onClose={() => setCoinModalOpen(false)}
            studentId={student.id}
            studentName={student.fullName}
          />
        </>
      )}
    </div>
  );
};

export default StudentDetail;
