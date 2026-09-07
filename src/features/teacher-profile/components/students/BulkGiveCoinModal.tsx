import { useMemo, useState } from "react";
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
import { directionOptions } from "@/features/coin-rules/constants";
import { useBulkGiveCoinForm } from "@/features/students/hooks";
import { bulkCoinSourceTypeOptions } from "@/features/students/constants";

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
  title = "Ommaviy tanga berish",
  subtitle,
}: Props) => {
  const [search, setSearch] = useState("");

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
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-display text-ink">{title}</DialogTitle>
          <DialogDescription className="text-ink-soft">
            {subtitle ?? "Bir nechta o'quvchini tanlab, birdaniga tanga bering"}
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ism yoki telefon..."
                className="w-full rounded-xl border border-ink/10 bg-white pl-9 pr-3 py-2.5 text-sm text-ink outline-none focus:border-gold/50"
              />
            </div>

            {/* Select all */}
            <div className="flex items-center justify-between shrink-0">
              <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer select-none">
                <Checkbox
                  checked={
                    filteredStudents.length > 0 &&
                    filteredStudents.every((s) => selectedIds.includes(s.id))
                  }
                  onCheckedChange={() =>
                    toggleSelectAll(filteredStudents.map((s) => s.id))
                  }
                  className="border-ink/20 data-[state=checked]:bg-forest data-[state=checked]:border-forest"
                />
                Hammasini belgilash
              </label>
              <span className="text-xs font-medium text-forest bg-forest/10 rounded-full px-2.5 py-1">
                {selectedIds.length} ta tanlandi
              </span>
            </div>

            {/* Student list */}
            <div className="shrink-0 max-h-44 overflow-y-auto rounded-xl border border-ink/10 divide-y divide-ink/8">
              {filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users size={20} className="text-ink-soft/40 mb-2" />
                  <p className="text-sm text-ink-soft">
                    {search ? "Hech narsa topilmadi" : "O'quvchilar mavjud emas"}
                  </p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-paper-soft transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.includes(student.id)}
                      onCheckedChange={() => toggleSelect(student.id)}
                      className="border-ink/20 data-[state=checked]:bg-forest data-[state=checked]:border-forest"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">
                        {student.fullName}
                      </p>
                      <p className="text-xs text-ink-soft">{student.phone}</p>
                    </div>
                    {typeof student.balance === "number" && (
                      <span className="flex items-center gap-1 text-xs font-medium text-gold shrink-0">
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
                        ? "border-forest/40 bg-forest/10 text-forest"
                        : "border-ink/10 text-ink-soft"
                    }`}
                  >
                    Tanga qoidasi
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      form.setValue("mode", "custom", { shouldValidate: true })
                    }
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      mode === "custom"
                        ? "border-forest/40 bg-forest/10 text-forest"
                        : "border-ink/10 text-ink-soft"
                    }`}
                  >
                    Maxsus sabab
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto pr-1">
                  {mode === "rule" ? (
                    <div>
                      <ControlledSelect
                        control={form.control}
                        name="ruleId"
                        label="Qoidani tanlang"
                        isLoading={isRulesLoading}
                        placeholder={
                          isRulesLoading ? "Yuklanmoqda..." : "Qoidani tanlang"
                        }
                        options={activeRules.map((rule) => ({
                          value: rule.id,
                          label: `${rule.name} (${rule.direction === "earn" ? "+" : "-"}${rule.coinAmount} coin)`,
                        }))}
                      />
                      {selectedRule && (
                        <p className="text-xs text-ink-soft mt-1.5">
                          Har bir tanlangan o'quvchiga{" "}
                          <b className="text-ink">
                            {selectedRule.direction === "earn" ? "+" : "-"}
                            {selectedRule.coinAmount} coin
                          </b>{" "}
                          beriladi.
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
                              <FormLabel>Miqdor</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  placeholder="Masalan: 5"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.valueAsNumber || 0,
                                    )
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
                          label="Yo'nalish"
                          options={directionOptions}
                        />
                      </div>
                      <ControlledSelect
                        control={form.control}
                        name="sourceType"
                        label="Manba"
                        options={bulkCoinSourceTypeOptions}
                      />
                    </>
                  )}

                  <ControlledInput
                    control={form.control}
                    name="note"
                    label="Sabab (ixtiyoriy)"
                    placeholder={
                      mode === "rule"
                        ? "Berilmasa, qoida nomi asosida avtomatik yoziladi"
                        : "Masalan: Darsda faol qatnashgani uchun"
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={selectedIds.length === 0 || isPending}
                  className="w-full shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
                >
                  {isPending
                    ? "Yuborilmoqda..."
                    : `${selectedIds.length} ta o'quvchiga berish`}
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
      error?: string;
      newBalance?: number;
    }[];
  };
  studentsById: Map<string, BulkCoinStudent>;
  onClose: () => void;
  onGiveMore: () => void;
}) => {
  return (
    <div className="flex flex-col gap-3 overflow-hidden flex-1 min-h-0">
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5 text-sm text-forest">
          <CheckCircle2 size={15} />
          {result.successCount} muvaffaqiyatli
        </div>
        {result.failedCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-bloom">
            <XCircle size={15} />
            {result.failedCount} xato
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
                r.success
                  ? "border-forest/20 bg-forest/5"
                  : "border-bloom/20 bg-bloom/5"
              }`}
            >
              {r.success ? (
                <CheckCircle2
                  size={16}
                  className="text-forest shrink-0 mt-0.5"
                />
              ) : (
                <XCircle size={16} className="text-bloom shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">
                  {student?.fullName ?? r.studentId}
                </p>
                {r.success ? (
                  typeof r.newBalance === "number" && (
                    <p className="text-xs text-ink-soft mt-0.5">
                      Yangi balans: {r.newBalance} coin
                    </p>
                  )
                ) : (
                  <p className="text-xs text-bloom mt-0.5">{r.error}</p>
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
          className="flex-1 rounded-xl border border-ink/10 text-ink-soft px-4 py-2.5 text-sm font-medium hover:bg-paper-soft transition-colors"
        >
          Yana berish
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors"
        >
          Yopish
        </button>
      </div>
    </div>
  );
};
