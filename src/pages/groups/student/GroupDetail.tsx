import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, GraduationCap, Phone, UsersRound } from "lucide-react";
import { BackListButton } from "@/components/shared/back";
import { EmptyState } from "@/components/shared/states";
import { UserAvatar } from "@/components/shared/avatar";
import { Panel } from "@/components/shared/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useGroup } from "@/features/groups/hooks";

const GroupDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: group, isLoading, isError } = useGroup(id ?? "");

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-4 sm:space-y-5">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (isError || !group) {
    return (
      <div className="space-y-4">
        <BackListButton title={t("studentProfile.groups.tabs.groups")} />
        <div className="rounded-2xl border bg-card">
          <EmptyState icon={UsersRound} title={t("groups.detail.notFound")} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <BackListButton title={t("studentProfile.groups.tabs.groups")} />

      <header className="space-y-3 rounded-2xl border bg-card p-4 sm:p-5">
        <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight">
          {group.name}
        </h1>
        <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <div className="flex min-w-0 items-center gap-1.5">
            <dt>
              <BookOpen className="size-4 text-muted-foreground" aria-hidden />
              <span className="sr-only">{t("groups.info.course")}</span>
            </dt>
            <dd className="truncate font-medium">{group.course.title}</dd>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <dt>
              <GraduationCap className="size-4 text-muted-foreground" aria-hidden />
              <span className="sr-only">{t("common.teacher")}</span>
            </dt>
            <dd className="truncate">{group.teacher.fullName}</dd>
          </div>
          {group.teacher.phone && (
            <div className="flex items-center gap-1.5">
              <dt>
                <Phone className="size-4 text-muted-foreground" aria-hidden />
                <span className="sr-only">{t("common.phone")}</span>
              </dt>
              <dd>
                <a
                  href={`tel:${group.teacher.phone}`}
                  className="tabular-nums underline-offset-4 hover:text-primary hover:underline"
                >
                  {group.teacher.phone}
                </a>
              </dd>
            </div>
          )}
        </dl>
        {group.course.description && (
          <p className="max-w-prose text-sm text-muted-foreground">
            {group.course.description}
          </p>
        )}
      </header>

      <Panel
        title={t("studentProfile.groups.classmates", {
          count: group.students.length,
        })}
        flush
      >
        {!group.students.length ? (
          <EmptyState size="sm" icon={UsersRound} title={t("groups.table.empty")} />
        ) : (
          <ul className="grid border-t sm:grid-cols-2 xl:grid-cols-3">
            {group.students.map((member) => {
              const isMe = member.student.id === user?.id;
              return (
                <li
                  key={member.id}
                  className="flex items-center gap-3 border-b px-4 py-3 sm:px-5"
                >
                  <UserAvatar
                    name={member.student.fullName}
                    highlight={isMe}
                    className="size-8"
                  />
                  <span className="min-w-0 truncate text-sm">
                    {member.student.fullName}
                    {isMe && (
                      <span className="ml-1.5 text-xs font-medium text-primary">
                        ({t("studentProfile.groups.you")})
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
};

export default GroupDetail;
