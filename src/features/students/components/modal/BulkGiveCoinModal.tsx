import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, X, Users, Coins, CheckCircle2, XCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ControlledInput, ControlledSelect } from "@/components/controls";
import { getDirectionOptions } from "@/features/coin-rules/constants";
import { useBulkGiveCoinForm } from "../../hooks";
import {
  getBulkCoinSourceTypeOptions,
  MANUAL_COIN_MAX,
} from "../../constants";

export interface BulkCoinStudent {
  id: string;
  fullName: string;
  phone: string;
  balance?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  students: BulkCoinStudent[];
  groupId?: string;
  title?: string;
  subtitle?: string;
}

export const BulkGiveCoinModal = ({
  open,
  onClose,
  students,
  groupId,
  title,
  subtitle,
}: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const directionOptions = getDirectionOptions(t);
  const bulkCoinSourceTypeOptions = getBulkCoinSourceTypeOptions(t);

  const {
    form,
    mode,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    result,
    activeRules,
    isRulesLoading,
    isPending,
    submit,
    reset,
  } = useBulkGiveCoinForm({ groupId });

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) => s.fullName.toLowerCase().includes(q) || s.phone.includes(q),
    );
  }, [students, search]);

  const studentsById = useMemo(
    () => new Map(students.map((s) => [s.id, s])),
    [students],
  );

  const ruleId = form.watch("ruleId");
  const selectedRule = activeRules.find((r) => r.id === ruleId);

  const handleClose = () => {
    setSearch("");
    reset();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-140 p-0 bg-card border-border flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-foreground">
            {title ?? t("bulkCoin.defaultTitle")}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {subtitle ?? t("bulkCoin.defaultSubtitle")}
          </p>
        </SheetHeader>

        {result ? (
          <ResultsView
            result={result}
            studentsById={studentsById}
            onClose={handleClose}
            onGiveMore={reset}
          />
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="px-4 pt-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("bulkCoin.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Select all */}
            <div className="px-4 py-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
                <Checkbox
                  checked={
                    filteredStudents.length > 0 &&
                    filteredStudents.every((s) => selectedIds.includes(s.id))
                  }
                  onCheckedChange={() =>
                    toggleSelectAll(filteredStudents.map((s) => s.id))
                  }
                  className="border-border"
                />
                {t("bulkCoin.selectAll")}
              </label>
              <Badge
                variant="secondary"
                className="bg-info-soft text-info"
              >
                {t("bulkCoin.selectedCount", { count: selectedIds.length })}
              </Badge>
            </div>

            {/* Student list */}
            <ScrollArea className="px-4 h-[calc(100vh-540px)] shrink-0 border-b border-border pb-3">
              {filteredStudents.length === 0 ? (
                <EmptyState search={search} />
              ) : (
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedIds.includes(student.id)}
                        onCheckedChange={() => toggleSelect(student.id)}
                        className="border-border"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {student.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.phone}
                        </p>
                      </div>
                      {typeof student.balance === "number" && (
                        <span className="flex items-center gap-1 text-xs font-medium text-warning shrink-0">
                          <Coins size={12} />
                          {student.balance}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Coin form */}
            <Form {...form}>
              <form
                onSubmit={submit}
                className="flex-1 overflow-hidden flex flex-col"
              >
                <ScrollArea className="flex-1 p-4">
                  <Tabs
                    value={mode}
                    onValueChange={(v) =>
                      form.setValue("mode", v as "rule" | "custom", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <TabsList className="w-full bg-muted">
                      <TabsTrigger
                        value="rule"
                        className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-muted-foreground/30 text-muted-foreground data-[state=active]:text-foreground dark:data-[state=active]:text-muted-foreground"
                      >
                        {t("bulkCoin.tabs.rule")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="custom"
                        className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-muted-foreground/30 text-muted-foreground data-[state=active]:text-foreground dark:data-[state=active]:text-muted-foreground"
                      >
                        {t("bulkCoin.tabs.custom")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rule" className="space-y-3 mt-4">
                      <div>
                        <ControlledSelect
                          control={form.control}
                          name="ruleId"
                          label={t("bulkCoin.rule.label")}
                          isLoading={isRulesLoading}
                          placeholder={
                            isRulesLoading
                              ? t("bulkCoin.rule.loading")
                              : t("bulkCoin.rule.label")
                          }
                          options={activeRules.map((rule) => ({
                            value: rule.id,
                            label: `${rule.name} (${rule.direction === "earn" ? "+" : "-"}${rule.coinAmount} ${t("common.coinLabel")})`,
                          }))}
                        />
                        {selectedRule && (
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {t("bulkCoin.rule.hintPrefix")}{" "}
                            <b className="text-foreground">
                              {selectedRule.direction === "earn" ? "+" : "-"}
                              {selectedRule.coinAmount} {t("common.coinLabel")}
                            </b>{" "}
                            {t("bulkCoin.rule.hintSuffix")}
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="custom" className="space-y-3 mt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("common.amount")}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={MANUAL_COIN_MAX}
                                  placeholder={t("bulkCoin.custom.amountPlaceholder")}
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber || 0)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <ControlledSelect
                          control={form.control}
                          name="direction"
                          label={t("common.direction")}
                          options={directionOptions}
                        />
                      </div>
                      <ControlledSelect
                        control={form.control}
                        name="sourceType"
                        label={t("bulkCoin.custom.sourceLabel")}
                        options={bulkCoinSourceTypeOptions}
                      />
                    </TabsContent>
                  </Tabs>

                  <div className="mt-3">
                    <ControlledInput
                      control={form.control}
                      name="note"
                      label={t("bulkCoin.noteLabel")}
                      placeholder={
                        mode === "rule"
                          ? t("bulkCoin.notePlaceholderRule")
                          : t("bulkCoin.notePlaceholderCustom")
                      }
                    />
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isPending}
                      className="flex-1 border-border text-foreground"
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={selectedIds.length === 0 || isPending}
                      className="flex-1 bg-info hover:bg-info/90 text-white"
                    >
                      {isPending
                        ? t("common.sending")
                        : t("bulkCoin.submit", { count: selectedIds.length })}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

const ResultsView = ({
  result,
  studentsById,
  onClose,
  onGiveMore,
}: {
  result: {
    totalRequested: number;
    successCount: number;
    failedCount: number;
    results: {
      studentId: string;
      success: boolean;
      error?: string;
      newBalance?: number;
    }[];
  };
  studentsById: Map<string, BulkCoinStudent>;
  onClose: () => void;
  onGiveMore: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="px-4 py-4 flex items-center gap-4 border-b border-border">
        <div className="flex items-center gap-1.5 text-sm text-success">
          <CheckCircle2 size={15} />
          {t("bulkCoin.results.success", { count: result.successCount })}
        </div>
        {result.failedCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-destructive">
            <XCircle size={15} />
            {t("bulkCoin.results.failed", { count: result.failedCount })}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-2">
          {result.results.map((r) => {
            const student = studentsById.get(r.studentId);
            return (
              <div
                key={r.studentId}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  r.success
                    ? "border-success/30 bg-success-soft"
                    : "border-destructive/30 bg-destructive-soft"
                }`}
              >
                {r.success ? (
                  <CheckCircle2
                    size={16}
                    className="text-success shrink-0 mt-0.5"
                  />
                ) : (
                  <XCircle
                    size={16}
                    className="text-destructive shrink-0 mt-0.5"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {student?.fullName ?? r.studentId}
                  </p>
                  {r.success ? (
                    typeof r.newBalance === "number" && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t("bulkCoin.results.newBalance", {
                          balance: r.newBalance,
                        })}
                      </p>
                    )
                  ) : (
                    <p className="text-xs text-destructive mt-0.5">
                      {r.error}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-4 py-4 border-t border-border bg-card flex gap-2">
        <Button
          variant="outline"
          onClick={onGiveMore}
          className="flex-1 border-border text-foreground"
        >
          {t("bulkCoin.giveMore")}
        </Button>
        <Button
          onClick={onClose}
          className="flex-1 bg-info hover:bg-info/90 text-white"
        >
          {t("common.close")}
        </Button>
      </div>
    </div>
  );
};

const EmptyState = ({ search }: { search: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Users className="w-9 h-9 text-muted-foreground mb-2" />
      <p className="text-sm font-medium text-muted-foreground">
        {search
          ? t("bulkCoin.emptyNoResults")
          : t("bulkCoin.emptyNoStudents")}
      </p>
    </div>
  );
};
