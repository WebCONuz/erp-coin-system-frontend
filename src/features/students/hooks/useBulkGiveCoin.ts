import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useActiveCoinRulesList } from "@/features/coin-rules/hooks";
import { groupKeys } from "@/features/groups/constants";
import { useTeacherCoinLimit } from "@/features/tenant-settings/hooks";
import { translateApiError } from "@/ustils";
import { useBulkManualCoinTransaction, useApplyCoinRule } from "./useHook";
import {
  createBulkGiveCoinSchema,
  type BulkGiveCoinFormValues,
} from "../schema";
import type { ApplyCoinRuleResponse, BulkCoinResponse } from "../types";

const emptyValues: BulkGiveCoinFormValues = {
  mode: "rule",
  ruleId: "",
  amount: undefined,
  direction: "earn",
  sourceType: "bonus",
  note: "",
};

interface UseBulkGiveCoinFormOptions {
  groupId?: string;
  onSuccess?: () => void;
}

export const useBulkGiveCoinForm = ({
  groupId,
  onSuccess,
}: UseBulkGiveCoinFormOptions = {}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<
    BulkCoinResponse | ApplyCoinRuleResponse | null
  >(null);

  // Teacher uchun tenant limiti (admin uchun `null` — umumiy 100 000 chegarasi).
  const { limit: teacherCoinLimit } = useTeacherCoinLimit();
  const bulkGiveCoinSchema = useMemo(
    () => createBulkGiveCoinSchema(t, teacherCoinLimit),
    [t, teacherCoinLimit],
  );

  const form = useForm<BulkGiveCoinFormValues>({
    resolver: zodResolver(bulkGiveCoinSchema),
    defaultValues: emptyValues,
  });

  const mode = form.watch("mode");

  const { data: rulesData, isLoading: isRulesLoading } =
    useActiveCoinRulesList();
  const bulkManual = useBulkManualCoinTransaction();
  const applyRule = useApplyCoinRule();

  // Avtomatik qoidalar yo'qlama saqlanganda o'zi qo'llanadi — apply-rule ularni
  // rad etadi (400), shuning uchun ro'yxatda faqat qo'lda qo'llanadiganlar.
  const activeRules = useMemo(
    () => (rulesData?.data ?? []).filter((r) => r.triggerType === "manual"),
    [rulesData],
  );
  const isPending = bulkManual.isPending || applyRule.isPending;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (ids: string[]) => {
    setSelectedIds((prev) => (prev.length === ids.length ? [] : ids));
  };

  const reset = () => {
    form.reset(emptyValues);
    setSelectedIds([]);
    setResult(null);
  };

  // groupId/sessionId/limit xatolari endi butun so'rovni rad etadi — `code` bo'yicha tarjima.
  const onError = (error: unknown) => toast.error(translateApiError(error, t));

  // `groupId` faqat shu forma qaysi ekrandan ochilganini bilgani uchun mavjud
  // (masalan, guruh detali sahifasi) — coin qoidasi DTO'sida bu maydon yo'q,
  // shu sababli guruhga bog'liq keshlarni shu yerda, mutatsiyaning o'zidan
  // tashqarida eskirgan deb belgilaymiz: guruh detali sahifasi (`useGroup`)
  // aynan shu talabalar ro'yxati/balansini `groupKeys.oneGroupById` orqali
  // o'qiydi, shuning uchun faqat statistikani emas, shuni ham tozalash kerak.
  const invalidateGroupCaches = () => {
    if (!groupId) return;
    queryClient.invalidateQueries({ queryKey: groupKeys.oneGroupById(groupId) });
    queryClient.invalidateQueries({ queryKey: groupKeys.groupStats(groupId) });
  };

  const onValid = (values: BulkGiveCoinFormValues) => {
    if (selectedIds.length === 0) {
      toast.error(t("bulkCoin.minOneStudent"));
      return;
    }

    if (values.mode === "rule") {
      applyRule.mutate(
        {
          ruleId: values.ruleId!,
          studentIds: selectedIds,
          note: values.note || undefined,
        },
        {
          onSuccess: (res) => {
            setResult(res);
            invalidateGroupCaches();
            onSuccess?.();
          },
          onError,
        },
      );
      return;
    }

    bulkManual.mutate(
      {
        studentIds: selectedIds,
        amount: values.amount!,
        direction: values.direction,
        sourceType: values.sourceType,
        note: values.note || undefined,
        groupId,
      },
      {
        onSuccess: (res) => {
          setResult(res);
          invalidateGroupCaches();
          onSuccess?.();
        },
        onError,
      },
    );
  };

  const submit = form.handleSubmit(onValid);

  return {
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
  };
};
