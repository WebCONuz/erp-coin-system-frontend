import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/states";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Gift, SearchIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { TEXT_LIMITS, translateApiError } from "@/ustils";
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
      onError: (error) => toast.error(translateApiError(error, t)),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t("market.student.foundCount", { count: filtered.length })}
        </p>
        <div role="search" className="relative w-full sm:w-72">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            defaultValue={search}
            maxLength={TEXT_LIMITS.SEARCH}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("market.student.searchPlaceholder")}
            aria-label={t("market.student.searchPlaceholder")}
            className="h-9 pl-9"
          />
        </div>
      </div>

      {!filtered.length ? (
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={Gift}
            title={t("market.student.notFound")}
            description={t("market.student.notFoundHint")}
          />
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((reward) => (
            <li key={reward.id}>
            <StudentProductCard
              product={reward}
              balance={balance}
              onBuy={handleBuy}
              isBuying={
                purchaseReward.isPending && selected?.reward.id === reward.id
              }
            />
            </li>
          ))}
        </ul>
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
