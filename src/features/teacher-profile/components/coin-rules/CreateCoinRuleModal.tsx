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
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
} from "@/components/controls";
import { useCreateCoinRule } from "@/features/coin-rules/hooks";
import {
  getDirectionOptions,
  getSourceTypeOptions,
  getTriggerTypeOptions,
} from "@/features/coin-rules/constants";
import {
  createCoinRuleFormSchema,
  type CoinRuleFormValues,
} from "@/features/coin-rules/schema";
import { useMyTaughtGroups } from "../../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyValues: CoinRuleFormValues = {
  name: "",
  coinAmount: 1,
  direction: "earn",
  triggerType: "manual",
  sourceType: undefined,
  description: "",
  groupId: "",
};

export const CreateCoinRuleModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const { data: groups } = useMyTaughtGroups();
  const createRule = useCreateCoinRule();

  const directionOptions = getDirectionOptions(t);
  const triggerTypeOptions = getTriggerTypeOptions(t);
  const sourceTypeOptions = getSourceTypeOptions(t);

  const coinRuleFormSchema = useMemo(() => createCoinRuleFormSchema(t), [t]);

  const form = useForm<CoinRuleFormValues>({
    resolver: zodResolver(coinRuleFormSchema),
    defaultValues: emptyValues,
  });

  const triggerType = form.watch("triggerType");

  useEffect(() => {
    if (open) form.reset(emptyValues);
  }, [open, form]);

  useEffect(() => {
    if (triggerType === "manual") {
      form.setValue("sourceType", undefined);
    }
  }, [triggerType, form]);

  const onSubmit = (values: CoinRuleFormValues) => {
    if (!values.groupId) {
      toast.error(t("coinRules.teacherForm.groupRequiredError"));
      return;
    }
    if (values.triggerType === "auto" && !values.sourceType) {
      toast.error(t("coinRules.teacherForm.sourceTypeRequiredError"));
      return;
    }

    createRule.mutate(
      {
        name: values.name,
        coinAmount: values.coinAmount,
        direction: values.direction,
        triggerType: values.triggerType,
        sourceType:
          values.triggerType === "auto" ? values.sourceType : undefined,
        description: values.description || undefined,
        groupId: values.groupId,
      },
      {
        onSuccess: () => {
          toast.success(t("coinRules.teacherForm.createdToast"));
          onClose();
        },
        onError: (error: any) =>
          toast.error(error?.data?.message || t("common.error")),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-ink">
            {t("coinRules.teacherForm.title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 max-h-[70vh] overflow-y-auto"
          >
            <ControlledInput
              control={form.control}
              name="name"
              label={t("common.name")}
              placeholder={t("coinRules.namePlaceholderTeacher")}
              inputClassName="h-8"
            />

            <ControlledInput
              control={form.control}
              name="coinAmount"
              label={t("coinRules.amountLabel")}
              placeholder="10"
              isNumber
              inputClassName="h-8"
            />

            <div className="grid grid-cols-2 gap-3">
              <ControlledSelect
                control={form.control}
                name="direction"
                label={t("common.direction")}
                options={directionOptions}
              />
              <ControlledSelect
                control={form.control}
                name="triggerType"
                label={t("coinRules.triggerTypeLabel")}
                options={triggerTypeOptions}
              />

              {triggerType === "auto" && (
                <ControlledSelect
                  control={form.control}
                  name="sourceType"
                  label={t("coinRules.sourceTypeLabel")}
                  options={sourceTypeOptions}
                  placeholder={t("common.select")}
                />
              )}
            </div>

            <ControlledSelect
              control={form.control}
              name="groupId"
              label={t("common.group")}
              options={(groups ?? []).map((g) => ({
                value: g.id,
                label: g.name,
              }))}
              placeholder={t("coinRules.groupPlaceholder")}
              required
            />

            <ControlledTextarea
              control={form.control}
              name="description"
              label={t("coinRules.descriptionLabel")}
              placeholder={t("coinRules.descriptionPlaceholder")}
              className="resize-none h-20"
            />

            <button
              type="submit"
              disabled={createRule.isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
            >
              {createRule.isPending ? t("common.creating") : t("common.create")}
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
