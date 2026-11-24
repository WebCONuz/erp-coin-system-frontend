import { Hand, Lock, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { CardMenu } from "@/components/shared/card-menu";
import { CoinAmount } from "@/components/shared/coin";
import { cn } from "@/lib/utils";
import { getSourceTypeLabels } from "../constants";
import type { CoinRule } from "../types";

interface Props {
  data: CoinRule;
  groupName?: string;
  onEdit: (rule: CoinRule) => void;
  onDelete: (rule: CoinRule) => void;
}

/**
 * Tanga qoidasi (sabab). Yo'nalish — chap chiziq va summa rangi
 * (mukofot — yashil, jarima — qizil); fon neytral.
 */
export const CoinRuleCard = ({ data, groupName, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();
  const sourceTypeLabels = getSourceTypeLabels(t);
  const isPlus = data.direction === "earn";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-2.5 rounded-2xl border border-l-4 bg-card p-4",
        isPlus ? "border-l-success" : "border-l-destructive",
        !data.isActive && "opacity-75",
      )}
    >
      <div className="absolute top-2.5 right-2.5">
        <CardMenu
          title={data.name}
          onEdit={() => onEdit(data)}
          // Tizim (built-in) qoidasini o'chirib bo'lmaydi.
          onDelete={data.isBuiltIn ? undefined : () => onDelete(data)}
        />
      </div>

      <div className="pr-9">
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
