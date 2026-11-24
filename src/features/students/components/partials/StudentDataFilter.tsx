import {
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Plus,
  FileSpreadsheet,
  MoreHorizontal,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import { CoinIcon } from "@/components/shared/coin";
import { Form } from "@/components/ui/form";
import { ControlledInput, ControlledSelect } from "@/components/controls";
import { cn } from "@/lib/utils";
import { useStudentFilter, useStudentGroupOptions } from "../../hooks";
import type { StudentSortField } from "../../hooks/useFilter";
import { TEXT_LIMITS } from "@/ustils/api-limits";

interface StudentFilterProps {
  onAddStudent: () => void;
  onImportExcel?: () => void;
  onBulkGiveCoin?: () => void;
  /** Jami o'quvchilar soni (sarlavha ostida). */
  total?: number;
}

export const StudentDataFilter = ({
  onAddStudent,
  onImportExcel,
  onBulkGiveCoin,
  total,
}: StudentFilterProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { form, clearFilters, sortBy, sortOrder, toggleSort } =
    useStudentFilter();
  const { data: groups } = useStudentGroupOptions();
  const groupOptions =
    groups?.data.map((g) => ({ value: g.id, label: g.name })) ?? [];
  const sortOptions: { field: StudentSortField; label: string }[] = [
    { field: "fullName", label: t("common.name") },
    { field: "coin", label: t("sessions.results.coin") },
  ];

  const hasFilters =
    !!searchParams.get("search") ||
    !!searchParams.get("groupId") ||
    !!sortBy;

  const sortLabel = (dir: "asc" | "desc") =>
    dir === "asc" ? t("students.filter.sortAsc") : t("students.filter.sortDesc");

  return (
    <Form {...form}>
      <div className="w-full space-y-4">
        {/* Sarlavha va amallar */}
        <div className="flex items-start justify-between gap-3">
          <DashboardTitle
            title={t("admin.header.students")}
            description={
              total !== undefined
                ? t("students.list.count", { count: total })
                : undefined
            }
          />
          <div className="flex shrink-0 items-center gap-2">
            {onBulkGiveCoin && (
              <Button
                variant="outline"
                onClick={onBulkGiveCoin}
                className="hidden h-9 gap-2 px-3.5 md:inline-flex"
              >
                <CoinIcon className="size-4" />
                {t("students.filter.bulkGiveCoin")}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onImportExcel}
              disabled={!onImportExcel}
              title={!onImportExcel ? t("students.filter.comingSoon") : undefined}
              className="hidden h-9 gap-2 px-3.5 lg:inline-flex"
            >
              <FileSpreadsheet className="size-4" aria-hidden />
              {t("students.filter.importExcel")}
            </Button>
            <Button
              onClick={onAddStudent}
              className="h-9 gap-2 px-3.5"
              aria-label={t("students.filter.addStudent")}
            >
              <Plus className="size-4" aria-hidden />
              <span className="hidden sm:inline">
                {t("students.filter.addStudent")}
              </span>
            </Button>

            {/* Kichik ekranlarda ikkinchi darajali amallar menyuda */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 lg:hidden"
                  aria-label={t("students.filter.moreActions")}
                >
                  <MoreHorizontal className="size-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                {onBulkGiveCoin && (
                  <DropdownMenuItem
                    className="gap-2.5 md:hidden"
                    onClick={onBulkGiveCoin}
                  >
                    <CoinIcon className="size-4" />
                    {t("students.filter.bulkGiveCoin")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="gap-2.5"
                  disabled={!onImportExcel}
                  onClick={onImportExcel}
                >
                  <FileSpreadsheet className="size-4" aria-hidden />
                  <span className="flex-1">{t("students.filter.importExcel")}</span>
                  {!onImportExcel && (
                    <span className="text-xs text-muted-foreground">
                      {t("students.filter.comingSoon")}
                    </span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filtrlar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Tablar — status URL param ni boshqaradi */}
          <Tabs
            value={form.watch("status") || "active"}
            onValueChange={(val) => form.setValue("status", val)}
          >
            <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
              {[
                { value: "active", label: t("students.filter.activeStudents") },
                { value: "archive", label: t("groups.tabs.archive") },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-8 flex-none rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div
            role="search"
            aria-label={t("students.filter.label")}
            className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center"
          >
            {/* Qidiruv (ism yoki telefon) */}
            <div className="relative col-span-2 sm:w-64">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <ControlledInput
                control={form.control}
                name="search"
                maxLength={TEXT_LIMITS.SEARCH}
                placeholder={t("students.filter.searchPlaceholder")}
                inputClassName="h-9 pl-9"
              />
            </div>

            {/* Guruh (sinf) */}
            <div className="min-w-0 sm:w-44">
              <ControlledSelect
                control={form.control}
                name="groupId"
                options={groupOptions}
                placeholder={t("students.filter.allClasses")}
                className="w-full py-4.5"
              />
            </div>

            {/* Saralash */}
            <div
              role="group"
              aria-label={t("students.filter.sortLabel")}
              className="flex h-9 items-center gap-0.5 rounded-lg border bg-card p-0.5"
            >
              {sortOptions.map(({ field, label }) => {
                const isActive = sortBy === field;
                return (
                  <Button
                    key={field}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort(field)}
                    aria-pressed={isActive}
                    aria-label={
                      isActive ? `${label}, ${sortLabel(sortOrder)}` : label
                    }
                    className={cn(
                      "h-7 flex-1 gap-1.5 px-2.5 text-xs",
                      isActive
                        ? "bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {label}
                    {isActive ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="size-3" aria-hidden />
                      ) : (
                        <ArrowDown className="size-3" aria-hidden />
                      )
                    ) : (
                      <ArrowUpDown className="size-3 opacity-50" aria-hidden />
                    )}
                  </Button>
                );
              })}
            </div>

            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                className="col-span-2 h-9 gap-2 px-3 text-muted-foreground hover:text-foreground sm:col-span-1"
              >
                <X className="size-4" aria-hidden />
                {t("common.clear")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
};
