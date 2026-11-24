import { Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CoinAmount } from "@/components/shared/coin";
import type { LevelProgress } from "../../lib/level";
import { GardenPath } from "../GardenPath";

interface Props {
  fullName: string;
  balance: number;
  streak: number;
  /** `null` — do'konda faol sovg'a yo'q */
  progress: LevelProgress | null;
}

/**
 * O'quvchi "bog'"i — panelning markaziy elementi. Fon har ikki rejimda ham
 * to'q (`sidebar` tokeni): bog' yo'li va oltin tanga shu fonda ajralib turadi.
 */
export const HeroProgressCard = ({
  fullName,
  balance,
  streak,
  progress,
}: Props) => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-sidebar p-5 text-white sm:p-8">
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            {t("garden.hero.greeting", { name: fullName.split(" ")[0] })}
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/65">
            {t("garden.hero.subtitle")}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          {streak > 0 && (
            <p className="flex items-center gap-1.5 rounded-full bg-coin/15 px-3 py-1 text-xs font-medium text-coin">
              <Flame className="size-3.5" aria-hidden />
              {t("garden.hero.streak", { days: streak })}
            </p>
          )}
          <div className="sm:text-right">
            <p className="text-xs text-white/55">{t("garden.hero.balance")}</p>
            <CoinAmount
              value={balance}
              size="xl"
              animate
              className="mt-0.5 text-coin"
            />
          </div>
        </div>
      </div>

      <div className="relative mt-8 sm:mt-10">
        {progress ? (
          <>
            <p className="mb-8 text-sm font-medium text-white/70">
              {t("garden.levelWithName", {
                level: progress.level.daraja,
                name: t(`garden.levels.${progress.level.nameKey}`),
              })}
            </p>

            <GardenPath progress={progress} tone="dark" />

            <p className="mt-4 text-right text-xs text-white/55">
              {progress.nextLevel
                ? t("garden.coinsToNext", { amount: progress.coinsToNext })
                : t("garden.maxLevel")}
            </p>
          </>
        ) : (
          <GardenPath progress={null} tone="dark" />
        )}
      </div>
    </section>
  );
};
