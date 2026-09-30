import { useTranslation } from "react-i18next";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/** Teacher guruhning asosiy o'qituvchisi emas — sessiya/jadval orqali biriktirilgan. */
export const AssignedGroupBadge = ({ className }: Props) => {
  const { t } = useTranslation();

  return (
    <span
      title={t("teacherProfile.groups.assignedHint")}
      className={cn(
        "inline-flex items-center gap-1 shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gold/15 text-gold",
        className,
      )}
    >
      <Link2 size={10} />
      {t("teacherProfile.groups.assigned")}
    </span>
  );
};
