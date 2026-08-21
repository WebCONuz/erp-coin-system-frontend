import { Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRewardCategories, useDeleteRewardCategory } from "../hooks";
import { NoData } from "@/components/partials/no-data";
import { useTranslation } from "react-i18next";
import { NoDataBox } from "@/features/tenants/components/ui";
import { PageLoading } from "@/components/loading";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CategoryFormModal } from "./CategoryFormModal";
import type { RewardCategory } from "../types";

export const GiftCategory = () => {
  const { data: categories, isLoading } = useRewardCategories();
  const deleteCategory = useDeleteRewardCategory();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeCategoryData, setActiveCategoryData] = useState<
    RewardCategory | undefined
  >(undefined);

  const selectCategory = (key: string, value: string | undefined | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newParams.set(key, value);
      setSearchParams(newParams, { replace: true });
      setSelectedCategory("all");
    } else {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      setSearchParams(newParams, { replace: true });
      setSelectedCategory(value || "");
    }
  };

  const categoryQuery = searchParams.get("category");
  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryQuery]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setActiveCategoryData(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, categoryItem: RewardCategory) => {
    e.stopPropagation();
    setModalMode("edit");
    setActiveCategoryData(categoryItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveCategoryData(undefined);
  };

  const handleDelete = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    if (window.confirm(t("reward_categories.delete_confirm"))) {
      deleteCategory.mutate(categoryId);
    }
  };

  return (
    <>
      <aside className="flex flex-col gap-y-2.5 rounded-2xl bg-background p-6 shadow-sm">
        <h3 className="text-lg font-semibold pb-3">
          {t("reward_categories.title")}
        </h3>

        {isLoading ? (
          <PageLoading />
        ) : categories ? (
          <>
            {categories.length === 0 ? (
              <NoDataBox
                title={t("reward_categories.no_data")}
                btnText={t("reward_categories.btn.create")}
                btnFn={handleOpenCreate}
              />
            ) : (
              <>
                <div
                  onClick={() => selectCategory("category", "all")}
                  className={`py-2 px-3 cursor-pointer text-lg font-medium rounded-md hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 ${selectedCategory === "all" ? "bg-primary/10 dark:bg-primary/20 text-primary" : "bg-bg-primary dark:bg-black"}`}
                >
                  {t("reward_categories.all")}
                </div>
                {categories.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectCategory("category", item.id)}
                    className={`flex items-center justify-between py-2 px-3 cursor-pointer text-lg font-medium rounded-md hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 ${selectedCategory === item.id ? "bg-primary/10 dark:bg-primary/20 text-primary" : "bg-bg-primary dark:bg-black"}`}
                  >
                    <span className="flex items-center gap-2">
                      {item.name}
                      <span className="text-xs text-muted-foreground">
                        ({item._count?.rewards ?? 0})
                      </span>
                    </span>
                    <div className="flex gap-x-2.5">
                      <Pencil
                        size="15"
                        className="text-gray-500 hover:text-green-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
                        onClick={(e) => handleOpenEdit(e, item)}
                      />
                      <Trash
                        size="15"
                        className="text-gray-500 hover:text-red-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
                        onClick={(e) => handleDelete(e, item.id)}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  onClick={handleOpenCreate}
                  className="mt-2 h-12 flex items-center gap-x-2 justify-center text-lg font-medium rounded-md bg-linear-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                >
                  <Plus />
                  <span>{t("reward_categories.btn.add")}</span>
                </Button>
              </>
            )}
          </>
        ) : (
          <NoData text={t("no_loading")} />
        )}
      </aside>

      <CategoryFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        category={activeCategoryData}
      />
    </>
  );
};
