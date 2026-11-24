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
import { EmptyState } from "@/components/shared/states";
import { UserX } from "lucide-react";

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
      <div className="space-y-4">
        <BackListButton title={t("admin.header.students")} />
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={UserX}
            title={t("students.detail.notFound")}
            action={
              <Button variant="outline" onClick={() => navigate("/admin/students")}>
                {t("admin.header.students")}
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
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

      <StatisticSection student={student} />

      <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Telefonda tablar sig'masa — faqat tab qatori suriladi */}
            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
                {studentTabOptions.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="h-8 flex-none rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <InfoTab student={student} />
            <GroupTab isDeleted={isDeleted} student={student} />
            <CoinTab isDeleted={isDeleted} />
            <GiftTab student={student} />
            <SecurityTab
              isActive={isActive}
              isDeleted={isDeleted}
              setConfirmAction={setConfirmAction}
            />
            {canSeeHistory && <HistoryTab student={student} />}
          </Tabs>
        </div>

        <StudentDetailSidebar student={student} />
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
