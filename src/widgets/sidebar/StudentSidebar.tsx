import { Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useStudentLevel } from "@/features/student-profile/hooks";
import { AppSidebar } from "./AppSidebar";
import { useStudentNavItems } from "./useStudentNavItems";

/** O'quvchi sidebar'i — pastida "bog'" darajasi (do'konda faol sovg'a bo'lsa). */
export const StudentSidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const items = useStudentNavItems();
  const { progress } = useStudentLevel(user?.wallet?.balance ?? 0);

  return (
    <AppSidebar
      items={items}
      storageKey="student_sidebar_collapsed"
      subtitle={t("brand.tagline")}
      footer={
        progress && (
          <div className="rounded-xl bg-sidebar-accent p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-sidebar-accent-foreground">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-coin/20 text-coin">
                <Sprout className="size-4" aria-hidden />
              </span>
              <span className="truncate">
                {t("garden.levelWithName", {
                  level: progress.level.daraja,
                  name: t(`garden.levels.${progress.level.nameKey}`),
                })}
              </span>
            </p>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress.bandProgress)}
              aria-label={t("garden.levelLabel", { level: progress.level.daraja })}
              className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10"
            >
              <div
                className="h-full rounded-full bg-coin transition-[width] duration-500"
                style={{ width: `${progress.bandProgress}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-sidebar-muted">
              {progress.nextLevel
                ? t("garden.coinsToNextShort", { amount: progress.coinsToNext })
                : t("garden.maxLevelShort")}
            </p>
          </div>
        )
      }
    />
  );
};
