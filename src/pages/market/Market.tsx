import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  GiftCategory,
  ProductDataFilter,
  ProductGrid,
  PurchaseHistoryTab,
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
  const [activeTab, setActiveTab] = useState("shop");

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

  if (!isStudent) {
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
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full h-auto flex-wrap gap-1 w-fit">
        <TabsTrigger
          value="shop"
          className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          Do'kon
        </TabsTrigger>
        <TabsTrigger
          value="purchases"
          className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          Xaridlarim
        </TabsTrigger>
      </TabsList>

      <TabsContent value="shop" className="space-y-4">
        <ProductDataFilter />
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-1">
            <GiftCategory noAction />
          </div>
          <div className="col-span-4">
            <ProductGrid />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="purchases">
        <PurchaseHistoryTab />
      </TabsContent>
    </Tabs>
  );
};
export default Market;
