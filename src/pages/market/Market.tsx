import { useState } from "react";
import {
  GiftCategory,
  ProductDataFilter,
  ProductGrid,
  RewardFormModal,
} from "@/features/market/components";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { ROLES } from "@/assets/constants";

const Market = () => {
  const { user } = useAuth();
  const isStudent = user?.role.name === ROLES.STUDENT;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreate = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <>
      <ProductDataFilter onAddGift={isStudent ? undefined : handleOpenCreate} />
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-1">
          <GiftCategory />
        </div>
        <div className="col-span-4">
          <ProductGrid
            onAddGift={isStudent ? undefined : handleOpenCreate}
          />
        </div>
      </div>

      {!isStudent && (
        <RewardFormModal open={isModalOpen} onClose={handleClose} />
      )}
    </>
  );
};
export default Market;
