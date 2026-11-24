import type { ReactNode } from "react";
import { SearchX, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { cn } from "@/lib/utils";

interface Props<T> {
  items?: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  isLoading?: boolean;
  /** Ma'lumot umuman kelmagan xatolik (kesh bo'lsa, ro'yxat ko'rsatiladi). */
  isError?: boolean;
  onRetry?: () => void;
  isRetrying?: boolean;
  /** Qidiruv/tab filtri qo'yilganmi — bo'sh holat matni shunga qarab. */
  isFiltered?: boolean;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyHint?: string;
  emptyAction?: ReactNode;
  filteredTitle?: string;
  filteredHint?: string;
  skeletonClassName?: string;
  className?: string;
}

const DEFAULT_GRID =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

/** Kartalar ro'yxati: yuklanish, xatolik, bo'sh va filtrlangan-bo'sh holatlar bilan. */
export const CardGrid = <T,>({
  items,
  getKey,
  renderItem,
  isLoading,
  isError,
  onRetry,
  isRetrying,
  isFiltered,
  emptyIcon,
  emptyTitle,
  emptyHint,
  emptyAction,
  filteredTitle,
  filteredHint,
  skeletonClassName = "h-36",
  className = DEFAULT_GRID,
}: Props<T>) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div aria-busy="true" className={className}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={cn("rounded-2xl", skeletonClassName)} />
        ))}
      </div>
    );
  }

  if (isError && !items) {
    return <ErrorState onRetry={onRetry} isRetrying={isRetrying} />;
  }

  if (!items?.length) {
    return (
      <div className="rounded-2xl border bg-card">
        {isFiltered ? (
          <EmptyState
            icon={SearchX}
            title={filteredTitle ?? t("common.nothingFound")}
            description={filteredHint ?? t("common.changeFilters")}
          />
        ) : (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyHint}
            action={emptyAction}
          />
        )}
      </div>
    );
  }

  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};
