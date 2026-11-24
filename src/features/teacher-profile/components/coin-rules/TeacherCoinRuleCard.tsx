import { Hand, Lock, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { CoinAmount } from "@/components/shared/coin";
import { cn } from "@/lib/utils";
import { getSourceTypeLabels } from "@/features/coin-rules/constants";
import type { CoinRule } from "@/features/coin-rules/types";

/** Tanga qoidasi (o'qituvchi ko'rinishi, faqat o'qish) — admin kartasi bilan bir xil uslub. */
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
    <article
      className={cn(
        "flex h-full flex-col gap-2.5 rounded-2xl border border-l-4 bg-card p-4",
        isPlus ? "border-l-success" : "border-l-destructive",
        !data.isActive && "opacity-75",
      )}
    >
      <div>
        <h3 className="font-heading text-base font-semibold leading-snug">
          {data.name}
        </h3>
        <CoinAmount
          value={isPlus ? data.coinAmount : -data.coinAmount}
          signed
          className={cn(
            "mt-1 text-base",
            isPlus ? "text-success" : "text-destructive",
          )}
        />
      </div>

      {data.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {data.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {data.isBuiltIn && (
          <Badge variant="soft">
            <Lock aria-hidden />
            {t("coinRules.builtIn.badge")}
          </Badge>
        )}
        <Badge variant="secondary">
          {data.triggerType === "auto" ? (
            <Zap aria-hidden />
          ) : (
            <Hand aria-hidden />
          )}
          {data.triggerType === "auto"
            ? t("coinRules.triggerType.auto")
            : t("coinRules.triggerType.manual")}
        </Badge>
        {data.triggerType === "auto" && data.sourceType && (
          <Badge variant="secondary">
            {sourceTypeLabels[data.sourceType] ?? data.sourceType}
          </Badge>
        )}
        {groupName && (
          <Badge variant="secondary">
            <Users aria-hidden />
            {groupName}
          </Badge>
        )}
        {!data.isActive && (
          <Badge variant="danger">{t("coinRules.card.inactive")}</Badge>
        )}
      </div>
    </article>
  );
};
