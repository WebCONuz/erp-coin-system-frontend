import { Hand, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSourceTypeLabels } from "@/features/coin-rules/constants";
import type { CoinRule } from "@/features/coin-rules/types";

export const TeacherCoinRuleCard = ({
  data,
  groupName,
}: {
  data: CoinRule;
  groupName?: string;
}) => {
  const { t } = useTranslation();
  const sourceTypeLabels = getSourceTypeLabels(t);
  const isPlus = data.direction === "earn";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isPlus ? "border-forest/20 bg-forest/8" : "border-bloom/20 bg-bloom/8"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-ink pr-2">{data.name}</h4>
        {!data.isActive && (
          <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-paper-soft text-ink-soft">
            {t("coinRules.card.inactive")}
          </span>
        )}
      </div>

      <p
        className={`mt-1.5 font-display text-lg font-bold ${
          isPlus ? "text-forest" : "text-bloom"
        }`}
      >
        {isPlus ? "+" : "-"}
        {data.coinAmount} <span className="text-xs font-normal text-ink-soft">coin</span>
      </p>

      {data.description && (
        <p className="text-xs text-ink-soft mt-1.5 line-clamp-2">
          {data.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-white text-ink-soft border border-ink/10">
          {data.triggerType === "auto" ? (
            <Zap size={11} className="text-gold" />
          ) : (
            <Hand size={11} className="text-forest" />
          )}
          {data.triggerType === "auto"
            ? t("coinRules.triggerType.auto")
            : t("coinRules.triggerType.manual")}
        </span>

        {data.triggerType === "auto" && data.sourceType && (
          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-white text-ink-soft border border-ink/10">
            {sourceTypeLabels[data.sourceType] ?? data.sourceType}
          </span>
        )}

        {groupName && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-white text-ink-soft border border-ink/10">
            <Users size={11} />
            {groupName}
          </span>
        )}
      </div>
    </div>
  );
};
