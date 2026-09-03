import { Coins, Flame } from "lucide-react";
import type { LevelProgress } from "../../lib/level";
import { GardenPath } from "../GardenPath";

interface Props {
  fullName: string;
  balance: number;
  streak: number;
  progress: LevelProgress;
}

export const HeroProgressCard = ({
  fullName,
  balance,
  streak,
  progress,
}: Props) => {
  const { level, nextLevel, coinsToNext } = progress;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-forest text-paper p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-forest-light/60 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold">
            Salom, {fullName.split(" ")[0]}! 👋
          </h1>
          <p className="text-paper/60 text-sm mt-2 max-w-md">
            Bugun ham darslarga qatnashib va uy vazifalarini bajarib, bilim
            bog'ingizni yashillikka to'ldiring.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-bloom/15 border border-bloom/30 px-3 py-1 text-xs font-medium text-bloom">
              <Flame size={13} className="fill-bloom text-bloom" />
              {streak} kun ketma-ket faollik
            </div>
          )}
          <div className="text-left sm:text-right">
            <p className="text-xs text-paper/50">Coin balansi</p>
            <p className="font-display text-3xl font-bold text-gold flex items-center gap-1.5">
              <Coins size={22} />
              {balance}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-10">
        <p className="text-xs uppercase tracking-wide text-paper/50 mb-8">
          {level.daraja}-daraja — {level.name}
        </p>

        <GardenPath progress={progress} tone="dark" />

        <p className="text-right text-xs text-paper/50 mt-4">
          {nextLevel
            ? `Keyingi darajagacha ${coinsToNext} coin qoldi`
            : "Siz eng yuqori darajadasiz!"}
        </p>
      </div>
    </div>
  );
};
