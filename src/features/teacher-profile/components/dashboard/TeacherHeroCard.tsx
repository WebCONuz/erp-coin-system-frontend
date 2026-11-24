import { CalendarClock, GraduationCap, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardTitle } from "@/components/shared/title";
import { formatLongDate } from "@/ustils";

interface Props {
  fullName: string;
  totalActiveGroups: number;
  totalStudents: number;
  todaySessionsCount: number;
}

/** Salomlashish + ko'rsatkichlar qatori (admin dashboard bilan bir xil naqsh). */
export const TeacherHeroCard = ({
  fullName,
  totalActiveGroups,
  totalStudents,
  todaySessionsCount,
}: Props) => {
  const { t, i18n } = useTranslation();

  const stats = [
    {
      label: t("teacherProfile.dashboard.activeGroups"),
      value: totalActiveGroups,
      icon: UsersRound,
      to: "/teacher/groups",
    },
    {
      label: t("teacherProfile.dashboard.totalStudents"),
      value: totalStudents,
      icon: GraduationCap,
      to: "/teacher/students",
    },
    {
      label: t("teacherProfile.dashboard.todaySessions"),
      value: todaySessionsCount,
      icon: CalendarClock,
      to: "/teacher/sessions",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <DashboardTitle
        title={t("teacherProfile.dashboard.greeting", {
          name: fullName.split(" ")[0],
        })}
        description={formatLongDate(new Date(), i18n.language)}
      />

      <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <li key={to} className="bg-card">
            <Link
              to={to}
              className="block h-full px-3 py-3.5 transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-5 sm:py-4"
            >
              <span className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <Icon className="hidden size-4 shrink-0 sm:block" aria-hidden />
                <span className="line-clamp-2">{label}</span>
              </span>
              <span className="mt-1 block font-heading text-2xl font-semibold leading-tight tabular-nums sm:text-[28px]">
                {value}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
