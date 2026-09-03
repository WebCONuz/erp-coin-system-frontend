import type { LevelProgress } from "../lib/level";
import { GardenPath } from "./GardenPath";

export const GardenMapCard = ({ progress }: { progress: LevelProgress }) => {
  const { level, nextLevel, coinsToNext } = progress;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <h3 className="font-display text-sm font-semibold text-ink">
        Bilim bog'i xaritasi
      </h3>
      <p className="text-xs text-ink-soft mt-1">
        {level.daraja}-daraja
        {nextLevel
          ? ` · keyingisigacha ${coinsToNext} coin`
          : " · eng yuqori daraja"}
      </p>

      <div className="mt-10">
        <GardenPath progress={progress} tone="light" />
      </div>

      <div className="flex items-center gap-4 mt-9 pt-4 border-t border-ink/8 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold" />
          Erishilgan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full border border-ink/25" />
          Qulflangan
        </span>
      </div>
    </div>
  );
};
