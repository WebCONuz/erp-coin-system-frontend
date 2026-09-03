import { Coins, Gift } from "lucide-react";
import { getFileUrl } from "@/lib/utils";
import { getNearestGoal } from "../../lib/nearestGoal";
import type { Reward } from "../../types";

interface Props {
  rewards: Reward[];
  balance: number;
}

export const StudentMarketHero = ({ rewards, balance }: Props) => {
  const goal = getNearestGoal(rewards, balance);
  const progress = goal
    ? Math.min(100, (balance / goal.coinPrice) * 100)
    : 100;
  const remaining = goal ? Math.max(0, goal.coinPrice - balance) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-forest text-paper p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="min-w-0 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            Bog'ingiz hosili
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-1.5">
            Har bir coin — mehnatingizning mevasi
          </h1>
          <p className="text-paper/60 text-sm mt-2">
            Darslarga qatnashib va uy vazifalarini bajarib to'plagan
            tangalaringizni sovg'alarga almashtiring.
            {goal &&
              ` Eng yaqin maqsadingiz — atigi ${goal.coinPrice} coin uzoqlikda!`}
          </p>
        </div>

        {goal && (
          <div className="shrink-0 w-full lg:w-64 rounded-2xl bg-white/8 border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                {goal.imageUrl ? (
                  <img
                    src={getFileUrl(goal.imageUrl)}
                    alt={goal.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Gift size={18} className="text-gold" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{goal.title}</p>
                <p className="text-[11px] text-paper/50">
                  Eng yaqin maqsadingiz
                </p>
              </div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mt-3">
              <div
                className="h-full rounded-full bg-gold transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[11px] text-paper/50">
              <span className="flex items-center gap-1">
                <Coins size={11} />
                {balance}/{goal.coinPrice} coin
              </span>
              <span className="text-gold font-medium">
                {remaining > 0 ? `Yana ${remaining} coin` : "Yetarli!"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
