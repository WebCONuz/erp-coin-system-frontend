import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Gift, Plus, SearchX } from "lucide-react";
import { ProductCard } from "@/components/shared/cards";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { ROLES } from "@/assets/constants";
import { translateApiError } from "@/ustils";
import { useRewards, usePurchaseReward, useDeleteReward } from "../hooks";
import type { Reward } from "../types";
import { RewardInventory } from "./RewardInventory";

interface Props {
  onAddGift?: () => void;
  onEdit?: (reward: Reward) => void;
}

const GRID =
  "grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5";

export const ProductGrid = ({ onAddGift, onEdit }: Props) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isStudent = user?.role.name === ROLES.STUDENT;

  const { data: rewards, isLoading, isError, refetch, isFetching } =
    useRewards();
  const purchaseReward = usePurchaseReward();
  const deleteReward = useDeleteReward();

  const handleBuy = (reward: Reward) => {
    if (!window.confirm(t("market.buyConfirm", { title: reward.title })))
      return;

    purchaseReward.mutate(reward.id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (error) => toast.error(translateApiError(error, t)),
    });
  };

  const handleDelete = (reward: Reward) => {
    if (!window.confirm(t("market.deleteConfirm", { title: reward.title })))
      return;

    deleteReward.mutate(reward.id, {
      onError: (error) => toast.error(translateApiError(error, t)),
    });
  };

  if (isLoading) {
    return (
      <div aria-busy="true" className={GRID}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-3/4 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError && !rewards) {
    return <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />;
  }

  const list = rewards?.data ?? [];
  const category = searchParams.get("category");
  const isFiltered =
    !!searchParams.get("search") ||
    searchParams.get("status") === "archive" ||
    (!!category && category !== "all");

  if (!list.length) {
    return (
      <div className="rounded-2xl border bg-card">
        {isFiltered ? (
          <EmptyState
            icon={SearchX}
            title={t("market.empty.filteredTitle")}
            description={t("market.empty.filteredHint")}
          />
        ) : (
          <EmptyState
            icon={Gift}
            title={t("market.noGifts")}
            description={t("market.empty.hint")}
            action={
              onAddGift && (
                <Button onClick={onAddGift} className="gap-2">
                  <Plus className="size-4" aria-hidden />
                  {t("market.createGift")}
                </Button>
              )
            }
          />
        )}
      </div>
    );
  }

  return (
    <ul className={GRID}>
      {list.map((item) => (
        <li key={item.id}>
          <ProductCard
            product={item}
            onBuy={isStudent ? handleBuy : undefined}
            isBuying={purchaseReward.isPending}
            onEdit={isStudent ? undefined : onEdit}
            onDelete={isStudent ? undefined : handleDelete}
            footer={
              isStudent ? undefined : (
                <RewardInventory reward={item} linkReserved />
              )
            }
          />
        </li>
      ))}
    </ul>
  );
};
