import { parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  DoorOpen,
  GraduationCap,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatLongDate } from "@/ustils";
import { getSessionTypeLabel } from "../constants";
import type { SessionItem } from "../types";
import { isSessionPastDue } from "../utils";

interface Props {
  session: SessionItem;
  /** O'ng tomondagi amallar (qulflash, o'chirish). */
  actions?: React.ReactNode;
}

/** Sessiya tafsiloti sarlavhasi: nima, qachon, qayerda, kim — bir qarashda. */
export const SessionHeader = ({ session, actions }: Props) => {
  const { t, i18n } = useTranslation();
  const typeLabel = getSessionTypeLabel(t, session.sessionType);
  const isUnchecked = isSessionPastDue(session) && !session.isChecked;

  return (
    <header className="rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {session.sessionType !== "lesson" && (
              <Badge variant="info">{typeLabel}</Badge>
            )}
            <Badge variant="secondary">
              {t(`sessions.evaluationMode.${session.evaluationMode}`, {
                defaultValue: session.evaluationMode,
              })}
            </Badge>
            {session.isChecked ? (
              <Badge variant="success">
                <CheckCircle2 aria-hidden />
                {t("sessions.filter.checked")}
              </Badge>
            ) : (
              <Badge variant={isUnchecked ? "danger" : "warning"}>
                {t("sessions.filter.unchecked")}
              </Badge>
            )}
            {session.isLocked && (
              <Badge variant="secondary">
                <Lock aria-hidden />
                {t("sessions.locked")}
              </Badge>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight">
              {session.subject?.name ?? typeLabel}
            </h1>
            <p className="mt-1 text-[15px] text-muted-foreground">
              {session.group.name}
            </p>
          </div>

          <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Fact icon={CalendarDays} label={t("common.date")}>
              {formatLongDate(parseISO(session.sessionDate.slice(0, 10)), i18n.language)}
            </Fact>
            <Fact icon={Clock} label={t("sessions.detail.time")}>
              <span className="tabular-nums">
                {session.startTime} – {session.endTime}
              </span>
            </Fact>
            <Fact icon={DoorOpen} label={t("common.room")}>
              {session.room.name}
            </Fact>
            <Fact icon={GraduationCap} label={t("common.teacher")}>
              {session.teacher.fullName}
            </Fact>
          </dl>
        </div>

        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </header>
  );
};

const Fact = ({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-1.5">
    <dt>
      <Icon className="size-4 text-muted-foreground" aria-hidden />
      <span className="sr-only">{label}</span>
    </dt>
    <dd className="font-medium text-foreground">{children}</dd>
  </div>
);
