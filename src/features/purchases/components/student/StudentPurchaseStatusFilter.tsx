import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  getStudentPurchaseStatusLabels,
  PURCHASE_STATUSES,
  STUDENT_PURCHASE_STATUS_DOT_CLASS,
} from "../../constants";
import type { PurchaseStatus } from "../../types";

// Market sahifasida ?status sovg'alar filtri bilan to'qnashmasligi uchun
// alohida parametr.
export const PURCHASE_STATUS_PARAM = "purchaseStatus";

export const StudentPurchaseStatusFilter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = (searchParams.get(PURCHASE_STATUS_PARAM) ?? "") as
    | PurchaseStatus
    | "";
  const labels = getStudentPurchaseStatusLabels(t);

  const options: { value: PurchaseStatus | ""; label: string }[] = [
    { value: "", label: t("purchases.tabs.all") },
    ...PURCHASE_STATUSES.map((value) => ({ value, label: labels[value] })),
  ];
  const current = options.find((o) => o.value === status) ?? options[0];

  const select = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(PURCHASE_STATUS_PARAM, value);
    else next.delete(PURCHASE_STATUS_PARAM);
    next.delete("page");
    setSearchParams(next, { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-8 min-w-0 items-center gap-2 rounded-full border bg-white px-4 text-sm font-medium outline-none transition-colors hover:bg-paper-soft focus-visible:ring-2 focus-visible:ring-forest/20",
            status
              ? "border-forest/40 text-ink"
              : "border-ink/10 text-ink-soft",
          )}
        >
          {status ? (
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                STUDENT_PURCHASE_STATUS_DOT_CLASS[status],
              )}
            />
          ) : (
            <ListFilter size={15} className="shrink-0" />
          )}
          <span className="truncate">{current.label}</span>
          <ChevronDown size={14} className="shrink-0 text-ink-soft/70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value || "all"}
            onClick={() => select(option.value)}
            className={cn(
              "cursor-pointer gap-2 text-sm",
              status === option.value && "font-medium text-forest",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                option.value
                  ? STUDENT_PURCHASE_STATUS_DOT_CLASS[option.value]
                  : "bg-ink-soft/30",
              )}
            />
            <span className="flex-1">{option.label}</span>
            {status === option.value && (
              <span className="h-1.5 w-1.5 rounded-full bg-forest" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
