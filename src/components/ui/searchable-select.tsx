import * as React from "react";
import { useTranslation } from "react-i18next";
import { CheckIcon, ChevronDownIcon, SearchIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

/** Selects with more options than this switch to the searchable variant. */
export const SELECT_SEARCH_THRESHOLD = 10;

export interface SelectOption {
  value: string;
  label: string;
}

// Treat the different Uzbek apostrophe variants (o' / o‘ / oʻ) as the same character
const normalize = (text: string) =>
  text.toLocaleLowerCase().replace(/[‘’ʻʼ`´]/g, "'").trim();

type SearchableSelectProps = Omit<
  React.ComponentProps<"button">,
  "value" | "onChange"
> & {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  hasData?: boolean;
  clearData?: () => void;
  contentClassName?: string;
  valueClassName?: string;
};

function SearchableSelect({
  options,
  value,
  onValueChange,
  onOpenChange,
  placeholder,
  disabled,
  hasData,
  clearData,
  className,
  contentClassName,
  valueClassName,
  ...props
}: SearchableSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = React.useMemo(() => {
    const query = normalize(search);
    if (!query) return options;
    return options.filter((o) => normalize(o.label).includes(query));
  }, [options, search]);

  const handleOpenChange = (next: boolean) => {
    if (disabled && next) return;
    if (next) {
      setSearch("");
      setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    }
    setOpen(next);
    onOpenChange?.(next);
  };

  const selectOption = (option: SelectOption) => {
    onValueChange(option.value);
    handleOpenChange(false);
  };

  // Keep the highlighted option visible while navigating with the keyboard
  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = filtered[activeIndex];
      if (option) selectOption(option);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <div className="relative">
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            data-placeholder={selected ? undefined : ""}
            className={cn(
              "flex h-8 w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
              className,
            )}
            {...props}
          >
            <span
              className={cn("line-clamp-1 min-w-0 text-left", valueClassName)}
            >
              {selected?.label ?? placeholder}
            </span>
            <div className="size-4 shrink-0">
              {!hasData && (
                <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
              )}
            </div>
          </button>
        </PopoverTrigger>

        {hasData && clearData && (
          <button
            type="button"
            className="absolute right-2 top-1/2 z-10 flex size-5 -translate-y-1/2 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clearData();
            }}
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <PopoverContent
        align="start"
        className={cn(
          "w-(--radix-popover-trigger-width) min-w-36 gap-0 overflow-hidden p-0",
          contentClassName,
        )}
      >
        <div className="flex items-center gap-2 border-b border-input px-2.5">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("common.search")}
            className="h-9 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div
          ref={listRef}
          role="listbox"
          className="max-h-60 overflow-y-auto overscroll-contain p-1"
        >
          {filtered.length > 0 ? (
            filtered.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  data-index={index}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                  className={cn(
                    "relative flex w-full cursor-default items-center rounded-md py-1 pr-8 pl-1.5 text-sm select-none",
                    index === activeIndex && "bg-accent text-accent-foreground",
                  )}
                >
                  <span className="line-clamp-2">{option.label}</span>
                  {isSelected && (
                    <CheckIcon className="pointer-events-none absolute right-2 size-4" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-2 text-center text-sm text-muted-foreground">
              {t("common.nothingFound")}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { SearchableSelect };
