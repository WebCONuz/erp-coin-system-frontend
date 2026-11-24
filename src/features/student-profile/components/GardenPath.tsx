import { Coins, Leaf, Sprout, TreeDeciduous, Trees } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LevelProgress } from "../lib/level";

const LEVEL_ICONS = [Sprout, Leaf, TreeDeciduous, Trees];

interface Props {
  /** `null` — do'konda faol sovg'a yo'q, bo'sh holat ko'rsatiladi */
  progress: LevelProgress | null;
  tone?: "dark" | "light";
}

export const GardenPath = ({ progress, tone = "dark" }: Props) => {
  const { t } = useTranslation();
  const isDark = tone === "dark";

  if (!progress) {
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl border border-dashed px-4 py-3 ${
          isDark ? "border-white/15 bg-white/5" : "border-foreground/15 bg-muted/55"
        }`}
      >
        <Sprout
          size={18}
          className={isDark ? "text-white/40" : "text-muted-foreground/50"}
        />
        <div className="min-w-0">
          <p
            className={`text-sm font-medium ${
              isDark ? "text-white/80" : "text-foreground"
            }`}
          >
            {t("garden.noRewards")}
          </p>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? "text-white/50" : "text-muted-foreground"
            }`}
          >
            {t("garden.noRewardsHint")}
          </p>
        </div>
      </div>
    );
  }

  const { levels, level, pathProgress } = progress;

  return (
    <div className="relative">
      <div
        className={`absolute top-5 left-5 right-5 h-0.5 ${
          isDark ? "bg-white/15" : "bg-foreground/10"
        }`}
      />
      <div
        className="absolute top-5 left-5 h-0.5 bg-coin transition-all duration-700"
        style={{ width: `calc((100% - 2.5rem) * ${pathProgress / 100})` }}
      />
      <div className="relative flex justify-between">
        {levels.map((lvl, i) => {
          const Icon = LEVEL_ICONS[i] ?? Sprout;
          const isCurrent = lvl.daraja === level.daraja;
          const isDone = lvl.daraja < level.daraja;

          const isFirst = i === 0;
          const isLast = i === levels.length - 1;

          return (
            <div
              key={lvl.daraja}
              className="relative flex flex-col items-center gap-2 w-12"
            >
              {isCurrent && (
                <span
                  className={`absolute -top-7 whitespace-nowrap rounded-full bg-coin/15 px-2 py-0.5 text-[10px] font-semibold text-coin ${
                    isFirst
                      ? "left-0"
                      : isLast
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2"
                  }`}
                >
                  {t("garden.youAreHere")}
                </span>
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isCurrent
                    ? "bg-coin border-coin text-sidebar shadow-[0_0_0_4px_rgba(237,162,59,0.25)]"
                    : isDone
                      ? "bg-coin border-coin text-sidebar"
                      : isDark
                        ? "bg-sidebar-accent border-white/15 border-dashed text-white/30"
                        : "bg-muted/55 border-foreground/15 border-dashed text-muted-foreground/40"
                }`}
              >
                <Icon size={17} />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className={`text-[10px] sm:text-[11px] whitespace-nowrap ${
                    isCurrent
                      ? `font-medium ${isDark ? "text-coin-soft" : "text-coin"}`
                      : isDark
                        ? "text-white/40"
                        : "text-muted-foreground"
                  }`}
                >
                  {t("garden.levelLabel", { level: lvl.daraja })}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold tabular-nums whitespace-nowrap ${
                    isCurrent || isDone
                      ? "text-coin"
                      : isDark
                        ? "text-coin"
                        : "text-muted-foreground/70"
                  }`}
                >
                  <Coins size={10} className="shrink-0" />
                  {Math.round(lvl.min)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
