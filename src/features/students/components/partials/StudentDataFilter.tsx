import {
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Plus,
  FileSpreadsheet,
  Coins,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import { Form } from "@/components/ui/form";
import { ControlledInput, ControlledSelect } from "@/components/controls";
import { useStudentFilter, useStudentGroupOptions } from "../../hooks";
import type { StudentSortField } from "../../hooks/useFilter";

interface StudentFilterProps {
  onAddStudent: () => void;
  onImportExcel?: () => void;
  onBulkGiveCoin?: () => void;
}

export const StudentDataFilter = ({
  onAddStudent,
  onImportExcel,
  onBulkGiveCoin,
}: StudentFilterProps) => {
  const { t } = useTranslation();
  const { form, clearFilters, sortBy, sortOrder, toggleSort } =
    useStudentFilter();
  const { data: groups } = useStudentGroupOptions();
  const groupOptions =
    groups?.data.map((g) => ({ value: g.id, label: g.name })) ?? [];
  const sortOptions: { field: StudentSortField; label: string }[] = [
    { field: "fullName", label: t("common.name") },
    { field: "coin", label: "Coin" },
  ];

  return (
    <Form {...form}>
      <div className="w-full space-y-3 py-4">
        {/* 1-QATOR: Sarlavha va Harakat tugmalari */}
        <div className="flex items-center justify-between">
          <DashboardTitle title={t("admin.header.students")} />
          <div className="flex items-center gap-2">
            <Button
              onClick={onAddStudent}
              className="bg-linear-to-br from-purple-500 to-purple-700 text-white rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">
                {t("students.filter.addStudent")}
              </span>
            </Button>
            {onBulkGiveCoin && (
              <Button
                onClick={onBulkGiveCoin}
                className="bg-linear-to-br from-amber-500 to-amber-600 text-white rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
              >
                <Coins size={18} />
                <span className="hidden sm:inline">
                  {t("students.filter.bulkGiveCoin")}
                </span>
              </Button>
            )}
            <Button
              onClick={onImportExcel}
              disabled
              className="bg-linear-to-br from-emerald-500 to-emerald-700 text-white rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
            >
              <FileSpreadsheet size={18} />
              <span className="hidden sm:inline">
                {t("students.filter.importExcel")}
              </span>
            </Button>
          </div>
        </div>

        {/* 2-QATOR: Filtrlash paneli */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Tablar — status URL param ni boshqaradi */}
          <Tabs
            value={form.watch("status") || "active"}
            onValueChange={(val) => form.setValue("status", val)}
            className="bg-muted/50 p-1 rounded-lg border border-border"
          >
            <TabsList className="bg-transparent border-none gap-1 h-8">
              <TabsTrigger
                value="active"
                className="rounded-md px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
              >
                {t("students.filter.activeStudents")}
              </TabsTrigger>
              <TabsTrigger
                value="archive"
                className="rounded-md px-4 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
              >
                {t("groups.tabs.archive")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* O'ng tomondagi filtrlar guruhi */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Qidiruv (ism yoki telefon) + URL param integratsiyasi */}
            <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500/20 transition-all shadow-sm">
              <div className="pl-3 text-muted-foreground/60">
                <Search size={18} />
              </div>
              <ControlledInput
                control={form.control}
                name="search"
                placeholder={t("students.filter.searchPlaceholder")}
                inputClassName="border-none focus-within:ring-0 w-64 h-9 bg-transparent"
              />
            </div>

            {/* Guruh (Sinf) tanlash */}
            <div className="shadow-sm rounded-lg">
              <ControlledSelect
                control={form.control}
                name="groupId"
                options={groupOptions}
                placeholder={t("students.filter.allClasses")}
                className="w-40 py-4.5 rounded-lg bg-background border-border text-foreground hover:bg-accent/50 transition-colors"
              />
            </div>

            {/* Saralash (Sort) tugmalari */}
            <div className="flex items-center border border-border rounded-lg bg-background p-1 gap-1 shadow-sm">
              {sortOptions.map(({ field, label }) => {
                const isActive = sortBy === field;
                return (
                  <Button
                    key={field}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort(field)}
                    className={`h-7 px-2 gap-1.5 text-xs transition-colors ${
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {label}
                    {isActive ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={12} />
                      ) : (
                        <ArrowDown size={12} />
                      )
                    ) : (
                      <ArrowUpDown size={12} className="opacity-50" />
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Tozalash */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-9 px-3 rounded-lg border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-all gap-2"
            >
              <X size={16} />
              <span className="hidden md:inline">{t("common.clear")}</span>
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};
