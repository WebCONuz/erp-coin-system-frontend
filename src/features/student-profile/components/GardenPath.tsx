import { Leaf, Sprout, TreeDeciduous, Trees } from "lucide-react";
import { STUDENT_LEVELS, type LevelProgress } from "../lib/level";

const LEVEL_ICONS = [Sprout, Leaf, TreeDeciduous, Trees];

interface Props {
  progress: LevelProgress;
  tone?: "dark" | "light";
}

export const GardenPath = ({ progress, tone = "dark" }: Props) => {
  const { level, pathProgress } = progress;
  const isDark = tone === "dark";

  return (
    <div className="relative">
      <div
        className={`absolute top-5 left-5 right-5 h-0.5 ${isDark ? "bg-white/15" : "bg-ink/10"}`}
      />
      <div
        className="absolute top-5 left-5 h-0.5 bg-gold transition-all duration-700"
        style={{ width: `calc((100% - 2.5rem) * ${pathProgress / 100})` }}
      />
      <div className="relative flex justify-between">
        {STUDENT_LEVELS.map((lvl, i) => {
          const Icon = LEVEL_ICONS[i] ?? Sprout;
          const isCurrent = lvl.daraja === level.daraja;
          const isDone = lvl.daraja < level.daraja;

          const isFirst = i === 0;
          const isLast = i === STUDENT_LEVELS.length - 1;

          return (
            <div
              key={lvl.daraja}
              className="relative flex flex-col items-center gap-2 w-12"
            >
              {isCurrent && (
                <span
                  className={`absolute -top-7 whitespace-nowrap rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold ${
                    isFirst
                      ? "left-0"
                      : isLast
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2"
                  }`}
                >
                  SIZ SHU YERDA
                </span>
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isCurrent
                    ? "bg-gold border-gold text-forest-deep shadow-[0_0_0_4px_rgba(237,162,59,0.25)]"
                    : isDone
                      ? "bg-gold/20 border-gold/50 text-gold"
                      : isDark
                        ? "bg-white/5 border-white/15 border-dashed text-white/30"
                        : "bg-paper-soft border-ink/15 border-dashed text-ink-soft/40"
                }`}
              >
                <Icon size={17} />
              </div>
              <span
                className={`text-[11px] ${
                  isCurrent
                    ? `font-medium ${isDark ? "text-gold-soft" : "text-gold"}`
                    : isDark
                      ? "text-paper/40"
                      : "text-ink-soft"
                }`}
              >
                {lvl.daraja}-daraja
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
