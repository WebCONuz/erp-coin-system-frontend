import { BookOpenCheck, CheckCircle2, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

const TIPS = [
  {
    icon: CheckCircle2,
    iconClass: "text-primary bg-primary/10",
    key: "attend",
  },
  {
    icon: BookOpenCheck,
    iconClass: "text-coin bg-coin/15",
    key: "homework",
  },
  {
    icon: Flame,
    iconClass: "text-destructive bg-destructive/10",
    key: "streak",
  },
];

export const StudentEarnTips = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {TIPS.map((tip) => (
        <div
          key={tip.key}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tip.iconClass}`}
          >
            <tip.icon size={17} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {t(`market.student.tips.${tip.key}.title`)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t(`market.student.tips.${tip.key}.desc`)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
