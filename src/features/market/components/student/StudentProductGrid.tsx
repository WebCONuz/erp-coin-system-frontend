import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Gift, SearchIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { usePurchaseReward } from "../../hooks";
import { StudentProductCard } from "./StudentProductCard";
import { StudentPurchaseModal } from "./StudentPurchaseModal";
import type { Reward } from "../../types";

interface Props {
  rewards: Reward[];
  onGoToPurchases: () => void;
}

export const StudentProductGrid = ({ rewards, onGoToPurchases }: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const purchaseReward = usePurchaseReward();

  const balance = user?.wallet?.balance ?? 0;
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category");

  const filtered = rewards
    .filter((r) => !categoryId || r.categoryId === categoryId)
    .filter(
      (r) => !search || r.title.toLowerCase().includes(search.toLowerCase()),
    );

  const handleSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("search", value);
    else next.delete("search");
    setSearchParams(next, { replace: true });
  };

  // Modal ochilgan paytdagi balansni saqlab qolamiz — xariddan so'ng
  // `auth/me` qayta yuklanib balans o'zgarsa ham modal hisob-kitobi sakramaydi.
  const [selected, setSelected] = useState<{
    reward: Reward;
    balance: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuy = (reward: Reward) => {
    purchaseReward.reset();
    setSelected({ reward, balance });
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (!selected) return;

    purchaseReward.mutate(selected.reward.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {t("market.student.foundCount", { count: filtered.length })}
        </p>
        <div className="relative w-full sm:w-64">
          <SearchIcon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50"
          />
          <input
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("market.student.searchPlaceholder")}
            className="w-full rounded-xl border border-ink/10 bg-white pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 outline-none focus:border-gold/50"
          />
        </div>
      </div>

      {!filtered.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-ink/10 bg-white">
          <Gift size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">
            {t("market.student.notFound")}
          </p>
          <p className="text-xs text-ink-soft mt-1 max-w-xs">
            {t("market.student.notFoundHint")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filtered.map((reward) => (
            <StudentProductCard
              key={reward.id}
              product={reward}
              balance={balance}
              onBuy={handleBuy}
              isBuying={
                purchaseReward.isPending && selected?.reward.id === reward.id
              }
            />
          ))}
        </div>
      )}

      <StudentPurchaseModal
        reward={selected?.reward ?? null}
        balance={selected?.balance ?? balance}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleConfirm}
        isPending={purchaseReward.isPending}
        isSuccess={purchaseReward.isSuccess}
        remainingCoins={purchaseReward.data?.remainingCoins}
        successMessage={purchaseReward.data?.message}
        onGoToPurchases={() => {
          setIsModalOpen(false);
          onGoToPurchases();
        }}
      />
    </div>
  );
};
