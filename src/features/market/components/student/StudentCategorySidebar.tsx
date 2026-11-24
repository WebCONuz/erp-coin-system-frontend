import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tags } from "lucide-react";
import { FilterNav } from "@/components/shared/filter-nav";
import { useRewardCategories } from "../../hooks";

/** O'quvchi do'koni kategoriyalari (faqat tanlash, boshqaruvsiz). */
export const StudentCategorySidebar = ({
  totalCount,
}: {
  totalCount: number;
}) => {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useRewardCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("category") ?? "all";

  const select = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("category");
    else next.set("category", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <FilterNav
      title={t("market.student.categories")}
      items={[
        { id: "all", title: t("market.student.allCategories"), count: totalCount },
        ...(categories ?? []).map((cat) => ({
          id: cat.id,
          title: cat.name,
          count: cat._count?.rewards ?? 0,
        })),
      ]}
      selectedId={active}
      onSelect={select}
      emptyTitle={t("reward_categories.no_data")}
      emptyIcon={Tags}
      isLoading={isLoading}
    />
  );
};
