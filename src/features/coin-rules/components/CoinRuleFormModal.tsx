import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ControlledInput,
  ControlledSelect,
  type IOption,
} from "@/components/controls";
import { createCoinRuleFormSchema, type CoinRuleFormValues } from "../schema";
import {
  useActiveGroups,
  useCreateCoinRule,
  useUpdateCoinRule,
} from "../hooks";
import {
  ALL_GROUPS_VALUE,
  getDirectionOptions,
  getSourceTypeOptions,
  getTriggerTypeOptions,
  requiresGroupForAutoRule,
} from "../constants";
import type { CoinRule } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  coinRule?: CoinRule;
}

const emptyValues: CoinRuleFormValues = {
  name: "",
  coinAmount: 1,
  direction: "earn",
  triggerType: "auto",
  sourceType: "attendance",
  description: "",
  groupId: ALL_GROUPS_VALUE,
};

export const CoinRuleFormModal = ({ open, onClose, mode, coinRule }: Props) => {
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  // Asosiy qoidada direction/triggerType/sourceType/groupId qulflangan (backend 409).
  const isBuiltIn = isEdit && !!coinRule?.isBuiltIn;
  const createCoinRule = useCreateCoinRule();
  const updateCoinRule = useUpdateCoinRule(coinRule?.id ?? "");
  const isPending = createCoinRule.isPending || updateCoinRule.isPending;

  const directionOptions = getDirectionOptions(t);
  const triggerTypeOptions = getTriggerTypeOptions(t);
  const sourceTypeOptions = getSourceTypeOptions(t);

  const { data: groupsData } = useActiveGroups(open);
  const groupOptions: IOption[] = [
    { value: ALL_GROUPS_VALUE, label: t("coinRules.allGroups") },
    ...(groupsData?.data ?? []).map((group) => ({
      value: group.id,
      label: group.name,
    })),
  ];

  const coinRuleFormSchema = useMemo(() => createCoinRuleFormSchema(t), [t]);

  const form = useForm<CoinRuleFormValues>({
    resolver: zodResolver(coinRuleFormSchema),
    defaultValues: emptyValues,
  });

  const triggerType = form.watch("triggerType");
  const direction = form.watch("direction");
  const sourceType = form.watch("sourceType");
  const groupRequired =
    !isBuiltIn &&
    requiresGroupForAutoRule({ triggerType, direction, sourceType });

  useEffect(() => {
    if (!open) return;

    if (isEdit && coinRule) {
      form.reset({
        name: coinRule.name,
        coinAmount: coinRule.coinAmount,
        direction: coinRule.direction,
        triggerType: coinRule.triggerType,
        sourceType: coinRule.sourceType ?? undefined,
        description: coinRule.description ?? "",
        groupId: coinRule.groupId ?? ALL_GROUPS_VALUE,
      });
    } else {
      form.reset(emptyValues);
    }
  }, [open, isEdit, coinRule, form]);

  useEffect(() => {
    if (triggerType === "manual") {
      form.setValue("sourceType", undefined);
    } else if (!form.getValues("sourceType")) {
      form.setValue("sourceType", "attendance");
    }
  }, [triggerType]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

  const onSubmit = (values: CoinRuleFormValues) => {
    if (isBuiltIn && coinRule) {
      updateCoinRule.mutate(
        {
          name: values.name,
          coinAmount: values.coinAmount,
          description: values.description || undefined,
        },
        { onSuccess: () => onClose(), onError },
      );
      return;
    }

    const hasGroup = !!values.groupId && values.groupId !== ALL_GROUPS_VALUE;
    if (groupRequired && !hasGroup) {
      form.setError("groupId", {
        message: t("coinRules.teacherForm.groupRequiredError"),
      });
      return;
    }

    const data = {
      ...values,
      description: values.description || undefined,
      sourceType: values.triggerType === "auto" ? values.sourceType : undefined,
      groupId:
        values.groupId && values.groupId !== ALL_GROUPS_VALUE
          ? values.groupId
          : undefined,
    };

    if (isEdit && coinRule) {
      updateCoinRule.mutate(data, { onSuccess: () => onClose(), onError });
    } else {
      createCoinRule.mutate(data, { onSuccess: () => onClose(), onError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-110 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit
              ? t("coinRules.adminForm.editTitle")
              : t("coinRules.adminForm.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ControlledInput
              name="name"
              control={form.control}
              placeholder={t("coinRules.namePlaceholderAdmin")}
              label={t("common.name")}
              inputClassName="h-8"
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="coinAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("coinRules.amountLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
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
                placeholder={t("coinRules.directionPlaceholder")}
                disabled={isBuiltIn}
                clearable={!isBuiltIn}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ControlledSelect
                control={form.control}
                name="triggerType"
                label={t("coinRules.triggerTypeLabel")}
                options={triggerTypeOptions}
                placeholder={t("coinRules.triggerTypePlaceholder")}
                disabled={isBuiltIn}
                clearable={!isBuiltIn}
              />

              {triggerType === "auto" && (
                <ControlledSelect
                  control={form.control}
                  name="sourceType"
                  label={t("coinRules.sourceTypeLabel")}
                  options={sourceTypeOptions}
                  placeholder={t("coinRules.sourceTypePlaceholder")}
                  disabled={isBuiltIn}
                  clearable={!isBuiltIn}
                />
              )}
            </div>

            <div className="space-y-1.5">
              <ControlledSelect
                control={form.control}
                name="groupId"
                label={
                  groupRequired
                    ? t("common.group")
                    : t("coinRules.groupLabelOptional")
                }
                required={groupRequired}
                options={
                  groupRequired
                    ? groupOptions.filter((o) => o.value !== ALL_GROUPS_VALUE)
                    : groupOptions
                }
                placeholder={t("coinRules.groupPlaceholder")}
                disabled={isBuiltIn}
                clearable={!isBuiltIn}
              />
              {groupRequired && (
                <p className="text-xs text-muted-foreground">
                  {t("coinRules.builtIn.groupRequiredHint")}
                </p>
              )}
            </div>

            {isBuiltIn && (
              <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                {t("coinRules.builtIn.editHint")}
              </p>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("coinRules.descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("coinRules.descriptionPlaceholder")}
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? t("common.saving")
                    : t("common.creating")
                  : isEdit
                    ? t("common.save")
                    : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
