import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ProductCard } from "@/components/shared/cards";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { ROLES } from "@/assets/constants";
import { useRewards, usePurchaseReward, useDeleteReward } from "../hooks";
import type { Reward } from "../types";

interface Props {
  onAddGift?: () => void;
  onEdit?: (reward: Reward) => void;
}

export const ProductGrid = ({ onAddGift, onEdit }: Props) => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isStudent = user?.role.name === ROLES.STUDENT;

  const { data: rewards, isLoading } = useRewards();
  const purchaseReward = usePurchaseReward();
  const deleteReward = useDeleteReward();

  const handleBuy = (reward: Reward) => {
    if (!window.confirm(`"${reward.title}" ni sotib olishni tasdiqlaysizmi?`))
      return;

    purchaseReward.mutate(
      { rewardId: reward.id },
      {
        onSuccess: () => toast.success("Sovg'a muvaffaqiyatli sotib olindi"),
        onError: (error: any) =>
          toast.error(error?.data?.message || "Xatolik yuz berdi"),
      },
    );
  };

  const handleDelete = (reward: Reward) => {
    if (!window.confirm(`"${reward.title}" ni o'chirishni tasdiqlaysizmi?`))
      return;

    deleteReward.mutate(reward.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
    });
  };

  if (isLoading) return <PageLoading />;

  if (!rewards?.data) return <NoData text="Ma'lumotlar yuklanmadi!" />;

  if (rewards.data.length === 0) {
    return (
      <NoDataBox
        title="Hali sovg'alar mavjud emas!"
        btnText="Sovg'a yaratish"
        btnFn={onAddGift ?? (() => {})}
        hasAction={searchParams.get("status") === "active"}
      />
    );
  }

  return (
    <div className="grid grid-cols-5 gap-6">
      {rewards.data.map((item) => (
        <ProductCard
          key={item.id}
          product={item}
          onBuy={isStudent ? handleBuy : undefined}
          isBuying={purchaseReward.isPending}
          onEdit={isStudent ? undefined : onEdit}
          onDelete={isStudent ? undefined : handleDelete}
        />
      ))}
    </div>
  );
};
