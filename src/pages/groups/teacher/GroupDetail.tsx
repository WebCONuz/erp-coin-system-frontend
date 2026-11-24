import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  CalendarClock,
  ChevronRight,
  ShieldAlert,
  UserRound,
  UsersRound,
} from "lucide-react";
import { BackListButton } from "@/components/shared/back";
import { EmptyState } from "@/components/shared/states";
import { UserAvatar } from "@/components/shared/avatar";
import { CoinAmount, CoinIcon } from "@/components/shared/coin";
import { Panel } from "@/components/shared/panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isForbiddenError } from "@/ustils";
import { useGroup } from "@/features/groups/hooks";
import { GroupFillMeter } from "@/features/groups/components/ui";
import { useIsAssignedGroup } from "@/features/teacher-profile/hooks";
import { BulkGiveCoinModal } from "@/features/teacher-profile/components/students";
import { AssignedGroupBadge } from "@/features/teacher-profile/components/groups";

const GroupDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading, isError, error } = useGroup(id ?? "");
  const isAssignedGroup = useIsAssignedGroup();
  const [bulkCoinOpen, setBulkCoinOpen] = useState(false);

  const bulkCoinStudents = useMemo(
    () =>
      (group?.students ?? []).map((gs) => ({
        id: gs.student.id,
        fullName: gs.student.fullName,
        phone: gs.student.phone ?? "",
      })),
    [group],
  );

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-4 sm:space-y-5">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (isError || !group) {
    const forbidden = isForbiddenError(error);
    return (
      <div className="space-y-4">
        <BackListButton title={t("teacherProfile.groups.title")} />
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={forbidden ? ShieldAlert : UsersRound}
            title={
              forbidden
                ? t("teacherProfile.groups.detail.forbidden")
                : t("teacherProfile.groups.detail.notFound")
            }
          />
        </div>
      </div>
    );
  }

  const isAssigned = isAssignedGroup(group.teacher?.id);

  return (
    <div className="space-y-4 sm:space-y-5">
      <BackListButton title={t("teacherProfile.groups.title")} />

      {/* Sarlavha */}
      <header className="rounded-2xl border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight">
                {group.name}
              </h1>
              {isAssigned && <AssignedGroupBadge />}
            </div>
            <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <div className="flex min-w-0 items-center gap-1.5">
                <dt>
                  <BookOpen className="size-4 text-muted-foreground" aria-hidden />
                  <span className="sr-only">{t("groups.info.course")}</span>
                </dt>
                <dd className="truncate font-medium">{group.course.title}</dd>
              </div>
              {/* Biriktirilgan guruhda asosiy o'qituvchi boshqa odam — kimligini ko'rsatamiz. */}
              {isAssigned && group.teacher?.fullName && (
                <div className="flex min-w-0 items-center gap-1.5">
                  <dt>
                    <UserRound className="size-4 text-muted-foreground" aria-hidden />
                    <span className="sr-only">{t("common.teacher")}</span>
                  </dt>
                  <dd className="truncate">
                    {t("teacherProfile.groups.detail.mainTeacher", {
                      name: group.teacher.fullName,
                    })}
                  </dd>
                </div>
              )}
            </dl>
            {group.course.description && (
              <p className="max-w-prose text-sm text-muted-foreground">
                {group.course.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-3 lg:w-64">
            <Button asChild variant="outline" className="h-9 gap-2">
              <Link to={`/teacher/sessions?groupId=${group.id}`}>
                <CalendarClock className="size-4" aria-hidden />
                {t("teacherProfile.groups.detail.groupSessions")}
              </Link>
            </Button>
            <GroupFillMeter
              count={group.students.length}
              max={group.maxStudents}
              size="lg"
            />
          </div>
        </div>
      </header>

      {/* O'quvchilar */}
      <Panel
        title={t("teacherProfile.groups.detail.studentsTitle", {
          total: group.students.length,
        })}
        action={
          !!group.students.length && (
            <Button
              onClick={() => setBulkCoinOpen(true)}
              className="h-9 gap-2"
            >
              <CoinIcon className="size-4" />
              {t("teacherProfile.groups.detail.giveCoins")}
            </Button>
          )
        }
        flush
      >
        {!group.students.length ? (
          <EmptyState
            size="sm"
            icon={UsersRound}
            title={t("teacherProfile.groups.detail.noStudents")}
          />
        ) : (
          <ul className="divide-y border-t">
            {group.students.map((member) => (
              <li key={member.id}>
                <Link
                  to={`/teacher/students/${member.student.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-5"
                >
                  <UserAvatar name={member.student.fullName} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {member.student.fullName}
                    </span>
                    {member.student.phone && (
                      <span className="block text-xs tabular-nums text-muted-foreground">
                        {member.student.phone}
                      </span>
                    )}
                  </span>
                  {member.student.wallet && (
                    <CoinAmount
                      value={member.student.wallet.balance}
                      variant="pill"
                      size="sm"
                    />
                  )}
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <BulkGiveCoinModal
        open={bulkCoinOpen}
        onClose={() => setBulkCoinOpen(false)}
        students={bulkCoinStudents}
        groupId={group.id}
        title={t("teacherProfile.groups.detail.bulkCoinTitle")}
        subtitle={t("teacherProfile.groups.detail.bulkCoinSubtitle", {
          name: group.name,
        })}
      />
    </div>
  );
};

export default GroupDetail;
