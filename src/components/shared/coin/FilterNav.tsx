import { useTranslation } from "react-i18next";
import {
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { cn } from "@/lib/utils";

export interface FilterNavItem {
  id: string;
  title: string;
  count?: number;
  /** Tahrirlash/o'chirish menyusi (bo'lmasa — menyu chiqmaydi). */
  onEdit?: () => void;
  onDelete?: () => void;
}

interface Props {
  title: string;
  items: FilterNavItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  createLabel?: string;
  emptyTitle: string;
  emptyIcon: LucideIcon;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  isRetrying?: boolean;
}

/**
 * Kategoriya/kurs filtri: lg+ — chap panel ro'yxati; kichik ekranlarda —
 * gorizontal suriladigan chip'lar. Birinchi element odatda "Barchasi".
 */
export const FilterNav = ({
  title,
  items,
  selectedId,
  onSelect,
  onAdd,
  addLabel,
  createLabel,
  emptyTitle,
  emptyIcon,
  isLoading,
  isError,
  onRetry,
  isRetrying,
}: Props) => {
  const renderBody = () => {
    if (isLoading) {
      return (
        <div aria-busy="true" className="flex gap-2 lg:flex-col">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg lg:w-full" />
          ))}
        </div>
      );
    }
    if (isError) {
      return (
        <ErrorState
          className="py-6"
          onRetry={onRetry}
          isRetrying={isRetrying}
        />
      );
    }
    // Faqat "Barchasi" qolgan bo'lsa — haqiqiy element yo'q.
    if (items.length <= 1) {
      return (
        <EmptyState
          size="sm"
          icon={emptyIcon}
          title={emptyTitle}
          action={
            onAdd && (
              <Button onClick={onAdd} size="sm" className="gap-1.5">
                <Plus className="size-4" aria-hidden />
                {createLabel ?? addLabel}
              </Button>
            )
          }
        />
      );
    }

    return (
      <>
        {/* Kichik ekranlar: gorizontal chip'lar */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:hidden">
          <ul className="flex w-max gap-1.5 pb-1">
            {items.map((item) => {
              const isActive = selectedId === item.id;
              const hasMenu = !!(item.onEdit || item.onDelete);
              return (
                <li key={item.id} className="flex items-center">
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                      isActive
                        ? "border-primary/40 bg-primary-soft text-primary"
                        : "bg-card text-muted-foreground hover:text-foreground",
                      isActive && hasMenu && "rounded-r-none border-r-0",
                    )}
                  >
                    {item.title}
                    {item.count !== undefined && (
                      <span className="text-xs tabular-nums opacity-70">
                        {item.count}
                      </span>
                    )}
                  </button>
                  {isActive && hasMenu && (
                    <ItemMenu
                      item={item}
                      className="h-9 rounded-l-none rounded-r-full border border-l-0 border-primary/40 bg-primary-soft text-primary"
                    />
                  )}
                </li>
              );
            })}
            {onAdd && (
              <li>
                <button
                  type="button"
                  onClick={onAdd}
                  className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Plus className="size-4" aria-hidden />
                  {addLabel}
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* lg+: vertikal ro'yxat */}
        <ul className="hidden space-y-0.5 lg:block">
          {items.map((item) => {
            const isActive = selectedId === item.id;
            return (
              <li
                key={item.id}
                className={cn(
                  "group/item flex items-center rounded-lg transition-colors",
                  isActive ? "bg-primary-soft" : "hover:bg-muted",
                )}
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    isActive
                      ? "font-medium text-primary"
                      : "text-foreground/80",
                  )}
                >
                  <span className="truncate">{item.title}</span>
                  {item.count !== undefined && (
                    <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                      {item.count}
                    </span>
                  )}
                </button>
                {(item.onEdit || item.onDelete) && (
                  <ItemMenu
                    item={item}
                    className="mr-1 size-8 rounded-md text-muted-foreground opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100 [@media(hover:none)]:opacity-100"
                  />
                )}
              </li>
            );
          })}
        </ul>
        {onAdd && (
          <Button
            variant="outline"
            onClick={onAdd}
            className="mt-3 hidden h-9 w-full gap-2 lg:flex"
          >
            <Plus className="size-4" aria-hidden />
            {addLabel}
          </Button>
        )}
      </>
    );
  };

  return (
    <nav
      aria-label={title}
      className="min-w-0 lg:rounded-2xl lg:border lg:bg-card lg:p-3"
    >
      <h2 className="mb-2 hidden px-2 pt-1 font-heading text-sm font-semibold text-muted-foreground lg:block">
        {title}
      </h2>
      {renderBody()}
    </nav>
  );
};

const ItemMenu = ({
  item,
  className,
}: {
  item: FilterNavItem;
  className?: string;
}) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`${t("common.actions")}: ${item.title}`}
          className={cn(
            "flex shrink-0 items-center justify-center px-2 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
            className,
          )}
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {item.onEdit && (
          <DropdownMenuItem onClick={item.onEdit}>
            <Pencil className="size-4" aria-hidden />
            {t("common.edit")}
          </DropdownMenuItem>
        )}
        {item.onDelete && (
          <DropdownMenuItem variant="destructive" onClick={item.onDelete}>
            <Trash2 className="size-4" aria-hidden />
            {t("common.delete")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
