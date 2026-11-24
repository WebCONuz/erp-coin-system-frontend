import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, UserX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/states";
import { BackListButton } from "@/components/shared/back";
import { isForbiddenError } from "@/ustils";
import { useStudentById } from "@/features/students/hooks";
import { useMyTaughtGroups } from "@/features/teacher-profile/hooks";
import {
  TeacherStudentHeader,
  GiveCoinModal,
} from "@/features/teacher-profile/components/students";
import {
  AttendanceHistoryTabV2,
  CoinHistoryTab,
  ProfileStatsRow,
} from "@/features/student-profile/components";

const StudentDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useStudentById(id ?? "");
  // `/groups/me` endi sessiya/jadval orqali biriktirilgan guruhlarni ham
  // qaytaradi — shu guruhlardagi a'zolik ham "mening guruhim" hisoblanadi.
  const { data: myGroups } = useMyTaughtGroups();
  const [activeTab, setActiveTab] = useState("attendance");
  const [coinModalOpen, setCoinModalOpen] = useState(false);

  const myGroupIds = new Set((myGroups ?? []).map((g) => g.id));

  const tabOptions = [
    {
      value: "attendance",
      label: t("teacherProfile.students.tabs.attendance"),
    },
    { value: "coins", label: t("teacherProfile.students.tabs.coins") },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <BackListButton title={t("teacherProfile.students.backToList")} />

      {isLoading ? (
        <div aria-busy="true" className="space-y-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      ) : isError || !student ? (
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={isForbiddenError(error) ? ShieldAlert : UserX}
            title={
              isForbiddenError(error)
                ? t("teacherProfile.students.forbidden")
                : t("teacherProfile.students.notFound")
            }
          />
        </div>
      ) : (
        <>
          <TeacherStudentHeader
            student={student}
            myGroupIds={myGroupIds}
            onGiveCoin={() => setCoinModalOpen(true)}
          />

          <ProfileStatsRow student={student} />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
              {tabOptions.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-8 flex-none rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <AttendanceHistoryTabV2 student={student} />
            {/* Teacher /history da faqat o'zi berganlarini ko'radi — to'liq tarix (oxirgi 20 ta) /students/:id da. */}
            <CoinHistoryTab
              transactions={student.coinTransactionsReceived ?? []}
            />
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
