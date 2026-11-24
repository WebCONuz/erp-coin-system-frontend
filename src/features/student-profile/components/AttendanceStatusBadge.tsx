import { Check, Clock, ShieldCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { resolveAttendanceStatus } from "@/features/sessions/constants";
import type { AttendanceStatus } from "@/features/sessions/types";

const STATUS_STYLES: Record<
  AttendanceStatus,
  { className: string; Icon: typeof Check }
> = {
  present: { className: "bg-primary/10 text-primary", Icon: Check },
  late: { className: "bg-warning-soft text-warning", Icon: Clock },
  excused: { className: "bg-foreground/5 text-muted-foreground", Icon: ShieldCheck },
  absent: { className: "bg-destructive/10 text-destructive", Icon: X },
};

interface Props {
  status?: AttendanceStatus | null;
  /** `status` bo'lmagan eski yozuvlar uchun. */
  isPresent: boolean;
  className?: string;
}

/** Davomat holati: keldi / kechikdi / sababli / sababsiz. */
export const AttendanceStatusBadge = ({
  status,
  isPresent,
  className,
}: Props) => {
  const { t } = useTranslation();
  const resolved = resolveAttendanceStatus({ status, isPresent }) ?? "absent";
  const { className: tone, Icon } = STATUS_STYLES[resolved];

  return (
    <span
      className={cn(
        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
        tone,
        className,
      )}
    >
      <Icon size={11} />
      <span className="text-xs">
        {t(`sessions.attendance.status.${resolved}`)}
      </span>
    </span>
  );
};
