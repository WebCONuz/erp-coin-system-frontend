import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useActiveCoinRulesList } from "@/features/coin-rules/hooks";
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<
    BulkCoinResponse | ApplyCoinRuleResponse | null
  >(null);

  const bulkGiveCoinSchema = useMemo(() => createBulkGiveCoinSchema(t), [t]);

  const form = useForm<BulkGiveCoinFormValues>({
    resolver: zodResolver(bulkGiveCoinSchema),
    defaultValues: emptyValues,
  });

  const mode = form.watch("mode");

  const { data: rulesData, isLoading: isRulesLoading } =
    useActiveCoinRulesList();
  const bulkManual = useBulkManualCoinTransaction();
  const applyRule = useApplyCoinRule();

  const activeRules = rulesData?.data ?? [];
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

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

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
    isRulesLoading,
    isPending,
    submit,
    reset,
  };
};
