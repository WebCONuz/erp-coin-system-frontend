import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/states";
import {
  AttendanceHistoryTabV2,
  CoinHistoryTab,
  PurchaseHistoryTab,
  ProfileStatsRow,
  StudentProfileHeader,
  GardenMapCard,
} from "@/features/student-profile/components";
import { EditMyProfileModal } from "@/features/profile/components";
import {
  useMyCoinHistory,
  useMyProfile,
  useStudentLevel,
} from "@/features/student-profile/hooks";

const TAB_OPTIONS = [
  { value: "attendance", labelKey: "studentProfile.tabs.attendance" },
  { value: "coins", labelKey: "studentProfile.tabs.coins" },
  { value: "gifts", labelKey: "studentProfile.tabs.purchases" },
];

const StudentProfilePage = () => {
  const { t } = useTranslation();
  const { data: student, isLoading, isError, refetch, isFetching } =
    useMyProfile();
  const [activeTab, setActiveTab] = useState("attendance");
  const [editOpen, setEditOpen] = useState(false);
  const { progress } = useStudentLevel(student?.wallet?.balance ?? 0);
  // O'z tarixi — teskari yozuvlar (`reversalOfId`/`reversal`) /my-history da keladi.
  const coinHistory = useMyCoinHistory({ limit: "20" });

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-4 sm:space-y-5">
        <Skeleton className="h-36 rounded-3xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }
  if (isError || !student) {
    return <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <StudentProfileHeader
        student={student}
        onEdit={() => setEditOpen(true)}
      />
      <ProfileStatsRow student={student} />
      <GardenMapCard progress={progress} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
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

        <AttendanceHistoryTabV2 student={student} />
        <CoinHistoryTab
          transactions={coinHistory.data?.data ?? []}
          isLoading={coinHistory.isLoading}
        />
        <PurchaseHistoryTab />
      </Tabs>

      <EditMyProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
};

export default StudentProfilePage;
