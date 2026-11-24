import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/avatar";
import { CoinAmount, CoinIcon } from "@/components/shared/coin";
import type { StudentDetailFull } from "@/features/students/types";

interface Props {
  student: StudentDetailFull;
  myGroupIds: Set<string>;
  onGiveCoin: () => void;
}

/** O'qituvchi ko'radigan o'quvchi sarlavhasi: kim, qaysi guruhim, balans. */
export const TeacherStudentHeader = ({
  student,
  myGroupIds,
  onGiveCoin,
}: Props) => {
  const { t } = useTranslation();
  const myMemberships = (student.groupMemberships ?? []).filter((gm) =>
    myGroupIds.has(gm.group.id),
  );

  return (
    <header className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <UserAvatar
          name={student.fullName}
          url={student.avatarUrl}
          className="size-14 rounded-2xl text-lg sm:size-16"
        />
        <div className="min-w-0">
          <h1 className="truncate font-heading text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
            {student.fullName}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="size-3.5" aria-hidden />
            <span className="tabular-nums">{student.phone}</span>
          </p>
          {myMemberships.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {myMemberships.map((gm) => (
                <li
                  key={gm.id}
                  className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground/80"
                >
                  {gm.group.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <div className="sm:text-right">
          <p className="text-xs text-muted-foreground">
            {t("students.detail.coinBalance")}
          </p>
          <CoinAmount
            value={student.wallet?.balance ?? 0}
            size="lg"
            className="mt-0.5"
          />
        </div>
        <Button onClick={onGiveCoin} className="h-9 gap-2">
          <CoinIcon className="size-4" />
          {t("teacherProfile.students.coinAdjustButton")}
        </Button>
      </div>
    </header>
  );
};
