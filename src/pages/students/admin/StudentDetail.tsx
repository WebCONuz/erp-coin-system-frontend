import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { canViewAuditLogs, translateApiError } from "@/ustils";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentDetailSkeleton } from "@/features/students/components/ui";
import {
  useStudentById,
  useDeactivateStudent,
} from "@/features/students/hooks";
import {
  StudentFormModal,
  SendMessageModal,
} from "@/features/students/components/modal";
import { ConfirmModal } from "@/components/shared/modal";
import {
  StatisticSection,
  StudentDetailHeader,
  StudentDetailSidebar,
} from "@/features/students/components/partials";
import {
  getStudentTabOptions,
  StudentActions,
} from "@/features/students/constants";
import type { ConfirmAction } from "@/features/students/types";
import {
  InfoTab,
  CoinTab,
  GiftTab,
  GroupTab,
  SecurityTab,
  HistoryTab,
} from "@/features/students/components/tab-contents";
import { BackListButton } from "@/components/shared/back";

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user } = useAuth();
  const { data: student, isLoading, isError } = useStudentById(id ?? "");
  const deactivate = useDeactivateStudent(id ?? "");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [activeTab, setActiveTab] = useState("info");

  const isActive = student?.isActive ?? false;
  const isDeleted = student?.isDeleted ?? false;
  const { confirmContent } = StudentActions(student, t);
  const canSeeHistory = canViewAuditLogs(user?.role);
  const studentTabOptions = getStudentTabOptions(t, {
    withHistory: canSeeHistory,
  });

  const handleConfirm = () => {
    if (!id) return;
    const options = {
      onSuccess: () => setConfirmAction(null),
      onError: (error: unknown) => toast.error(translateApiError(error, t)),
    };
    if (confirmAction === "archive")
      deactivate.mutate({ isActive: false }, options);
    else if (confirmAction === "restore")
      deactivate.mutate({ isActive: true }, options);
    else if (confirmAction === "delete")
      deactivate.mutate({ isDeleted: true }, options);
  };

  if (isLoading) return <StudentDetailSkeleton />;
  if (isError || !student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-zinc-500 dark:text-zinc-400">
          {t("students.detail.notFound")}
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          {t("common.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackListButton title={t("admin.header.students")} />
      <StudentDetailHeader
        isActive={isActive}
        isDeleted={isDeleted}
        student={student}
        setActiveTab={setActiveTab}
        setConfirmAction={setConfirmAction}
        setIsEditOpen={setIsEditOpen}
        setIsMsgOpen={setIsMsgOpen}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <StatisticSection student={student} />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full h-auto flex-wrap gap-1">
              {studentTabOptions.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <InfoTab
              student={student}
              isDeleted={isDeleted}
              setIsEditOpen={setIsEditOpen}
            />
            <GroupTab isDeleted={isDeleted} student={student} />
            <CoinTab isDeleted={isDeleted} student={student} />
            <GiftTab student={student} />
            <SecurityTab
              isActive={isActive}
              isDeleted={isDeleted}
              setConfirmAction={setConfirmAction}
            />
            {canSeeHistory && <HistoryTab student={student} />}
          </Tabs>
        </div>

        <StudentDetailSidebar
          isDeleted={isDeleted}
          setIsEditOpen={setIsEditOpen}
          setIsMsgOpen={setIsMsgOpen}
          student={student}
        />
      </div>

      {/* ── Modals ── */}
      <StudentFormModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        mode="edit"
        student={student}
      />

      <SendMessageModal
        open={isMsgOpen}
        onClose={() => setIsMsgOpen(false)}
        student={student}
      />

      {confirmAction && (
        <ConfirmModal
          open={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
          title={confirmContent[confirmAction].title}
          description={confirmContent[confirmAction].description}
          confirmLabel={confirmContent[confirmAction].label}
          variant={confirmContent[confirmAction].variant}
          isPending={deactivate.isPending}
        />
      )}
    </div>
  );
};

export default StudentDetail;
