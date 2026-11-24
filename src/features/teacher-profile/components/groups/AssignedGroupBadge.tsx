import { useTranslation } from "react-i18next";
import { Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  className?: string;
}

/** Teacher guruhning asosiy o'qituvchisi emas — sessiya/jadval orqali biriktirilgan. */
export const AssignedGroupBadge = ({ className }: Props) => {
  const { t } = useTranslation();

  return (
    <Badge
      variant="info"
      title={t("teacherProfile.groups.assignedHint")}
      className={className}
    >
      <Link2 aria-hidden />
      {t("teacherProfile.groups.assigned")}
    </Badge>
  );
};
