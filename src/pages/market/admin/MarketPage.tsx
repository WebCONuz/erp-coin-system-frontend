import { useState } from "react";
import {
  GiftCategory,
  ProductDataFilter,
  ProductGrid,
  RewardFormModal,
} from "@/features/market/components";
import type { Reward } from "@/features/market/types";

const AdminMarketPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const handleCreate = () => {
    setEditingReward(null);
    setIsModalOpen(true);
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingReward(null);
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <ProductDataFilter onAddGift={handleCreate} />

        {/* lg+: chapda kategoriyalar; kichik ekranlarda kategoriya chip'lari tepada */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-5">
          <div className="min-w-0 lg:sticky lg:top-0">
            <GiftCategory />
          </div>
          <ProductGrid onAddGift={handleCreate} onEdit={handleEdit} />
        </div>
      </div>

      <RewardFormModal
        open={isModalOpen}
        onClose={handleClose}
        mode={editingReward ? "edit" : "create"}
        reward={editingReward ?? undefined}
      />
    </>
  );
};

export default AdminMarketPage;
