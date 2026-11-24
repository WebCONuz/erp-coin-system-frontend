import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Coins, Search, Users, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ControlledInput, ControlledSelect } from "@/components/controls";
import { getDirectionOptions } from "@/features/coin-rules/constants";
import { useBulkGiveCoinForm } from "@/features/students/hooks";
import { getBulkCoinSourceTypeOptions } from "@/features/students/constants";

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
    teacherCoinLimit,
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
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-heading text-foreground">
            {title ?? t("bulkCoin.defaultTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {subtitle ?? t("bulkCoin.defaultSubtitle")}
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <ResultsView
            result={result}
            studentsById={studentsById}
            onClose={handleClose}
            onGiveMore={reset}
          />
        ) : (
          <div className="flex flex-col gap-4 overflow-hidden flex-1 min-h-0">
            {/* Search */}
            <div className="relative shrink-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("bulkCoin.searchPlaceholder")}
                className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2.5 text-sm text-foreground outline-none focus:border-coin/50"
              />
            </div>

            {/* Select all */}
            <div className="flex items-center justify-between shrink-0">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
                <Checkbox
                  checked={
                    filteredStudents.length > 0 &&
                    filteredStudents.every((s) => selectedIds.includes(s.id))
                  }
                  onCheckedChange={() =>
                    toggleSelectAll(filteredStudents.map((s) => s.id))
                  }
                  className="border-foreground/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                {t("bulkCoin.selectAll")}
              </label>
              <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1">
                {t("bulkCoin.selectedCount", { count: selectedIds.length })}
              </span>
            </div>

            {/* Student list */}
            <div className="shrink-0 max-h-44 overflow-y-auto rounded-xl border border-border divide-y divide-border">
              {filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users size={20} className="text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {search
                      ? t("bulkCoin.emptyNoResults")
                      : t("bulkCoin.emptyNoStudents")}
                  </p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/55 transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.includes(student.id)}
                      onCheckedChange={() => toggleSelect(student.id)}
                      className="border-foreground/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {student.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">{student.phone}</p>
                    </div>
                    {typeof student.balance === "number" && (
                      <span className="flex items-center gap-1 text-xs font-medium text-coin shrink-0">
                        <Coins size={12} />
                        {student.balance}
                      </span>
                    )}
                  </label>
                ))
              )}
            </div>

            <Form {...form}>
              <form onSubmit={submit} className="contents">
                {/* Mode toggle */}
                <div className="grid grid-cols-2 gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      form.setValue("mode", "rule", { shouldValidate: true })
                    }
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      mode === "rule"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {t("bulkCoin.tabs.rule")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      form.setValue("mode", "custom", { shouldValidate: true })
                    }
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      mode === "custom"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {t("bulkCoin.tabs.custom")}
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto pr-1">
                  {mode === "rule" ? (
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
                  ) : (
                    <>
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
                                  max={teacherCoinLimit ?? undefined}
                                  placeholder={t(
                                    "bulkCoin.custom.amountPlaceholder",
                                  )}
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber || 0)
                                  }
                                />
                              </FormControl>
                              {teacherCoinLimit !== null && (
                                <p className="text-xs text-muted-foreground">
                                  {t("bulkCoin.teacherLimitHint", {
                                    limit: teacherCoinLimit,
                                  })}
                                </p>
                              )}
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
                    </>
                  )}

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

                <button
                  type="submit"
                  disabled={selectedIds.length === 0 || isPending}
                  className="w-full shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {isPending
                    ? t("common.sending")
                    : t("bulkCoin.submit", { count: selectedIds.length })}
                </button>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
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
      direction: "earn" | "deduct";
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
    <div className="flex flex-col gap-3 overflow-hidden flex-1 min-h-0">
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5 text-sm text-primary">
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

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {result.results.map((r) => {
          const student = studentsById.get(r.studentId);
          return (
            <div
              key={r.studentId}
              className={`flex items-start gap-3 p-3 rounded-xl border ${
                r.direction === "earn"
                  ? "border-primary/20 bg-primary/5"
                  : "border-destructive/20 bg-destructive/5"
              }`}
            >
              {r.success ? (
                <CheckCircle2
                  size={16}
                  className="text-primary shrink-0 mt-0.5"
                />
              ) : (
                <XCircle size={16} className="text-destructive shrink-0 mt-0.5" />
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
                  <p className="text-xs text-destructive mt-0.5">{r.error}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={onGiveMore}
          className="flex-1 rounded-xl border border-border text-muted-foreground px-4 py-2.5 text-sm font-medium hover:bg-muted/55 transition-colors"
        >
          {t("bulkCoin.giveMore")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
};
