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
      <ProductDataFilter onAddGift={handleCreate} />

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-1">
          <GiftCategory />
        </div>
        <div className="col-span-4">
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
