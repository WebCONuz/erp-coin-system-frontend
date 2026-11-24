import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Tags } from "lucide-react";
import { FilterNav } from "@/components/shared/filter-nav";
import { translateApiError } from "@/ustils";
import { useRewardCategories, useDeleteRewardCategory } from "../hooks";
import { CategoryFormModal } from "./CategoryFormModal";
import type { RewardCategory } from "../types";

interface Props {
  noAction?: boolean;
}

/** Sovg'a kategoriyalari filtri (`?category=`). */
export const GiftCategory = ({ noAction = false }: Props) => {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useRewardCategories();
  const deleteCategory = useDeleteRewardCategory();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  // Tanlangan kategoriya — URL'dan hisoblanadi.
  const selectedCategory = searchParams.get("category") || "all";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeCategoryData, setActiveCategoryData] = useState<
    RewardCategory | undefined
  >(undefined);

  const selectCategory = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", value);
    setSearchParams(newParams, { replace: true });
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setActiveCategoryData(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (categoryItem: RewardCategory) => {
    setModalMode("edit");
    setActiveCategoryData(categoryItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveCategoryData(undefined);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm(t("reward_categories.delete_confirm"))) {
      // Soft delete; faol sovg'asi bor kategoriya — 409 (backend xabari ko'rsatiladi).
      deleteCategory.mutate(categoryId, {
        onError: (error) => toast.error(translateApiError(error, t)),
      });
    }
  };

  const items = [
    { id: "all", title: t("reward_categories.all") },
    ...(categories ?? []).map((c) => ({
      id: c.id,
      title: c.name,
      count: c._count?.rewards ?? 0,
      ...(!noAction && {
        onEdit: () => handleOpenEdit(c),
        onDelete: () => handleDelete(c.id),
      }),
    })),
  ];

  return (
    <>
      <FilterNav
        title={t("reward_categories.title")}
        items={items}
        selectedId={selectedCategory}
        onSelect={selectCategory}
        onAdd={noAction ? undefined : handleOpenCreate}
        addLabel={t("reward_categories.btn.add")}
        createLabel={t("reward_categories.btn.create")}
        emptyTitle={t("reward_categories.no_data")}
        emptyIcon={Tags}
        isLoading={isLoading}
        isError={isError && !categories}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />

      <CategoryFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        category={activeCategoryData}
      />
    </>
  );
};
