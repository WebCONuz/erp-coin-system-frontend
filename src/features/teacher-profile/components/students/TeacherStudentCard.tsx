import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { StudentDetail } from "@/features/students/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/avatar";
import { CoinAmount, CoinIcon } from "@/components/shared/coin";
import { GiveCoinModal } from "./GiveCoinModal";

/** O'quvchi kartasi: profilga havola + alohida "Tanga berish" tugmasi. */
export const TeacherStudentCard = ({
  student,
  groupId,
}: {
  student: StudentDetail;
  groupId?: string;
}) => {
  const { t } = useTranslation();
  const [coinModalOpen, setCoinModalOpen] = useState(false);

  return (
    <>
      <article className="flex h-full flex-col rounded-2xl border bg-card">
        <Link
          to={`/teacher/students/${student.id}`}
          className="flex flex-1 items-center gap-3 rounded-t-2xl p-4 transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <UserAvatar name={student.fullName} url={student.avatarUrl} className="size-10" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold">
                {student.fullName}
              </span>
              {!student.isActive && (
                <Badge variant="secondary">{t("common.inactive")}</Badge>
              )}
            </p>
            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
              {student.phone}
            </p>
          </div>
        </Link>

        <div className="flex items-center justify-between gap-2 border-t px-4 py-2.5">
          <CoinAmount value={student.wallet?.balance ?? 0} variant="pill" size="sm" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-primary hover:bg-primary-soft hover:text-primary"
            onClick={() => setCoinModalOpen(true)}
            aria-label={`${t("teacherProfile.students.giveCoinButton")}: ${student.fullName}`}
          >
            <CoinIcon className="size-3.5" />
            {t("teacherProfile.students.giveCoinButton")}
          </Button>
        </div>
      </article>

      <GiveCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        studentId={student.id}
        studentName={student.fullName}
        defaultGroupId={groupId}
      />
    </>
  );
};
