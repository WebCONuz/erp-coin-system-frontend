import { useTranslation } from "react-i18next";
import type { LevelProgress } from "../lib/level";
import { GardenPath } from "./GardenPath";

interface Props {
  /** `null` — do'konda faol sovg'a yo'q */
  progress: LevelProgress | null;
}

export const GardenMapCard = ({ progress }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <h3 className="font-display text-sm font-semibold text-ink">
        {t("garden.map.title")}
      </h3>

      {progress ? (
        <>
          <p className="text-xs text-ink-soft mt-1">
            {t("garden.levelLabel", { level: progress.level.daraja })}
            {" · "}
            {progress.nextLevel
              ? t("garden.coinsToNextShort", { amount: progress.coinsToNext })
              : t("garden.maxLevelShort")}
          </p>

          <div className="mt-10">
            <GardenPath progress={progress} tone="light" />
          </div>

          <div className="flex items-center gap-4 mt-9 pt-4 border-t border-ink/8 text-xs text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold" />
              {t("garden.map.reached")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-ink/25" />
              {t("garden.map.locked")}
            </span>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <GardenPath progress={null} tone="light" />
        </div>
      )}
    </div>
  );
};
