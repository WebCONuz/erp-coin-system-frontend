import { Link } from "react-router-dom";
import { Gift } from "lucide-react";
import { useRewards } from "@/features/market/hooks";

export const WeeklyOfferCard = () => {
  const { data } = useRewards();
  const rewards = (data?.data ?? []).filter((r) => r.isActive !== false);
  const featured = rewards.length
    ? [...rewards].sort((a, b) => a.coinPrice - b.coinPrice)[0]
    : null;

  if (!featured) return null;

  return (
    <div className="rounded-2xl border border-gold/30 bg-gold-soft/25 p-5 flex flex-col">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">
        Haftaning taklifi
      </p>
      <p className="text-sm text-ink mt-2 flex-1">
        <b>"{featured.title}"</b> — {featured.coinPrice} coin evaziga sotib
        oling
      </p>
      <Link
        to="/student/market"
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-paper text-sm font-medium px-4 py-2.5 hover:bg-forest-light transition-colors"
      >
        <Gift size={15} />
        Do'konga o'tish
      </Link>
    </div>
  );
};
