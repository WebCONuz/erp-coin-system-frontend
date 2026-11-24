import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Calendar, GraduationCap, Pencil, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/ustils";
import type { GroupDetail } from "../../types";
import { GroupFillMeter } from "../ui";

interface GroupInfoProps {
  group: GroupDetail;
  onEdit: () => void;
}

/** Guruh tafsiloti sarlavhasi: nom, kurs, o'qituvchi, to'lganlik. */
export const GroupInfo = ({ group, onEdit }: GroupInfoProps) => {
  const { t } = useTranslation();

  return (
    <header className="rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight">
              {group.name}
            </h1>
            <Button
              variant="outline"
              onClick={onEdit}
              className="h-9 shrink-0 gap-2 lg:hidden"
            >
              <Pencil className="size-4" aria-hidden />
              {t("common.edit")}
            </Button>
          </div>

          <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Fact icon={BookOpen} label={t("groups.info.course")}>
              {group.course.title}
            </Fact>
            <Fact icon={GraduationCap} label={t("common.teacher")}>
              {group.teacher ? (
                <Link
                  to={`/admin/teachers/${group.teacher.id}`}
                  className="underline-offset-4 hover:text-primary hover:underline"
                >
                  {group.teacher.fullName}
                </Link>
              ) : (
                "—"
              )}
            </Fact>
            {group.teacher?.phone && (
              <Fact icon={Phone} label={t("common.phone")}>
                <span className="tabular-nums">{group.teacher.phone}</span>
              </Fact>
            )}
            <Fact icon={Calendar} label={t("groups.info.created_at")}>
              <span className="tabular-nums">
                {formatDate(group.createdAt, "dd.MM.yyyy")}
              </span>
            </Fact>
          </dl>

          {group.course.description && (
            <p className="max-w-prose text-sm text-muted-foreground">
              {group.course.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 lg:w-64 lg:items-end">
          <Button
            variant="outline"
            onClick={onEdit}
            className="hidden h-9 gap-2 lg:inline-flex"
          >
            <Pencil className="size-4" aria-hidden />
            {t("common.edit")}
          </Button>
          <GroupFillMeter
            count={group.students.length}
            max={group.maxStudents}
            size="lg"
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
};

const Fact = ({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Phone;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex min-w-0 items-center gap-1.5">
    <dt>
      <Icon className="size-4 text-muted-foreground" aria-hidden />
      <span className="sr-only">{label}</span>
    </dt>
    <dd className="truncate font-medium">{children}</dd>
  </div>
);
