import { Link } from "react-router-dom";
import { Gift } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useRewards } from "@/features/market/hooks";

/** Eng arzon faol sovg'a — keyingi maqsad sifatida. */
export const WeeklyOfferCard = () => {
  const { t } = useTranslation();
  const { data } = useRewards();
  const rewards = (data?.data ?? []).filter((r) => r.isActive !== false);
  const featured = rewards.length
    ? [...rewards].sort((a, b) => a.coinPrice - b.coinPrice)[0]
    : null;

  if (!featured) return null;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-coin/40 bg-coin-soft/60 p-4 sm:p-5">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-coin-ink">
        <Gift className="size-4" aria-hidden />
        {t("studentProfile.dashboard.weeklyOffer")}
      </p>
      <p className="mt-2 flex-1 text-sm">
        <Trans
          i18nKey="studentProfile.dashboard.weeklyOfferText"
          values={{ title: featured.title, price: featured.coinPrice }}
          components={{ b: <b className="font-semibold" /> }}
        />
      </p>
      <Button asChild className="mt-4 h-10 gap-2">
        <Link to="/student/market">{t("purchases.student.goToShop")}</Link>
      </Button>
    </div>
  );
};
