import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { getAuditActionBadgeClass, getAuditActionLabel } from "../constants";

interface Props {
  action: string;
  className?: string;
}

export const AuditActionBadge = ({ action, className }: Props) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        getAuditActionBadgeClass(action),
        className,
      )}
    >
      {getAuditActionLabel(t, action)}
    </span>
  );
};
