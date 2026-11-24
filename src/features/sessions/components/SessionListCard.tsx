import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  CalendarDays,
  DoorOpen,
  GraduationCap,
  Lock,
  MoreVertical,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { getSessionTypeLabel } from "../constants";
import type { SessionItem } from "../types";
import { isSessionPastDue } from "../utils";

interface Props {
  data: SessionItem;
  onDelete?: (session: SessionItem) => void;
  hasAction?: boolean;
  /** O'qituvchi sahifasida o'qituvchi nomi takrorlanmasin. */
  hideTeacher?: boolean;
  /** Guruh sahifasida guruh nomi takrorlanmasin. */
  hideGroup?: boolean;
  /** Sana kun sarlavhasida ko'rsatilmagan bo'lsa. */
  showDate?: boolean;
  /** Tafsilot sahifasi yo'li (teacher: `/teacher/sessions`). */
  basePath?: string;
}

export const SessionListCard = ({
  data,
  onDelete,
  hasAction = true,
  hideTeacher,
  hideGroup,
  showDate,
  basePath = "/admin/sessions",
}: Props) => {
  const { t } = useTranslation();

  const isPastDue = isSessionPastDue(data);
  const isUnchecked = isPastDue && !data.isChecked;
  const typeLabel = getSessionTypeLabel(t, data.sessionType);
  const title = data.subject?.name ?? typeLabel;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-card transition-colors hover:border-primary/40",
        isUnchecked &&
          "border-destructive/30 before:absolute before:inset-y-3 before:left-0 before:w-0.75 before:rounded-r-full before:bg-destructive",
      )}
    >
      <Link
        to={`${basePath}/${data.id}`}
        className="flex flex-1 flex-col gap-3 rounded-2xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="flex items-start justify-between gap-2 pr-7">
          <p className="font-heading text-[15px] font-semibold tabular-nums text-foreground">
            {data.startTime}
            <span className="text-muted-foreground"> – {data.endTime}</span>
          </p>
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-heading text-base font-semibold leading-snug">
            {title}
          </h3>
          {!hideGroup && (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {data.group.name}
            </p>
          )}
        </div>

        {(isUnchecked ||
          data.isLocked ||
          data.sessionType !== "lesson" ||
          data.evaluationMode === "scored") && (
          <div className="flex flex-wrap gap-1.5">
            {isUnchecked && (
              <Badge variant="danger">
                <AlertCircle aria-hidden />
                {t("sessions.notChecked")}
              </Badge>
            )}
            {data.isLocked && (
              <Badge variant="secondary">
                <Lock aria-hidden />
                {t("sessions.locked")}
              </Badge>
            )}
            {data.sessionType !== "lesson" && (
              <Badge variant="info">{typeLabel}</Badge>
            )}
            {data.evaluationMode === "scored" && (
              <Badge variant="soft">
                {t("sessions.evaluationMode.scored")}
              </Badge>
            )}
          </div>
        )}

        <dl className="mt-auto space-y-1 border-t pt-3 text-sm text-muted-foreground">
          {showDate && (
            <Meta icon={CalendarDays} label={t("common.date")}>
              {formatDate(data.sessionDate)}
            </Meta>
          )}
          <Meta icon={DoorOpen} label={t("common.room")}>
            {data.room.name}
          </Meta>
          {!hideTeacher && (
            <Meta icon={GraduationCap} label={t("common.teacher")}>
              {data.teacher.fullName}
            </Meta>
          )}
        </dl>

        {data.topic && (
          <p className="line-clamp-2 text-sm text-foreground/80">
            <span className="text-muted-foreground">
              {t("sessions.topicLabel")}:
            </span>{" "}
            {data.topic}
          </p>
        )}
      </Link>

      {hasAction && (
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t("common.actions")}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <MoreVertical className="size-4" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete?.(data)}
              >
                <Trash />
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </article>
  );
};

const Meta = ({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof DoorOpen;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex min-w-0 items-center gap-2">
    <dt className="shrink-0">
      <Icon className="size-4" aria-hidden />
      <span className="sr-only">{label}</span>
    </dt>
    <dd className="truncate">{children}</dd>
  </div>
);
