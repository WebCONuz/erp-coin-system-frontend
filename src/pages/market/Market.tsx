import { useState } from "react";
import {
  GiftCategory,
  ProductDataFilter,
  ProductGrid,
  RewardFormModal,
} from "@/features/market/components";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { ROLES } from "@/assets/constants";
import type { Reward } from "@/features/market/types";

const Market = () => {
  const { user } = useAuth();
  const isStudent = user?.role.name === ROLES.STUDENT;
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
      <ProductDataFilter onAddGift={isStudent ? undefined : handleCreate} />
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-1">
          <GiftCategory noAction={isStudent} />
        </div>
        <div className="col-span-4">
          <ProductGrid
            onAddGift={isStudent ? undefined : handleCreate}
            onEdit={isStudent ? undefined : handleEdit}
          />
        </div>
      </div>

      {!isStudent && (
        <RewardFormModal
          open={isModalOpen}
          onClose={handleClose}
          mode={editingReward ? "edit" : "create"}
          reward={editingReward ?? undefined}
        />
      )}
    </>
  );
};
export default Market;
