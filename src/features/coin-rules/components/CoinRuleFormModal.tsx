import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { coinRuleFormSchema, type CoinRuleFormValues } from "../schema";
import {
  useActiveGroups,
  useCreateCoinRule,
  useUpdateCoinRule,
} from "../hooks";
import {
  ALL_GROUPS_VALUE,
  directionOptions,
  sourceTypeOptions,
  triggerTypeOptions,
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
  const isEdit = mode === "edit";
  const createCoinRule = useCreateCoinRule();
  const updateCoinRule = useUpdateCoinRule(coinRule?.id ?? "");
  const isPending = createCoinRule.isPending || updateCoinRule.isPending;

  const { data: groupsData } = useActiveGroups(open);
  const groupOptions: IOption[] = [
    { value: ALL_GROUPS_VALUE, label: "Barcha guruhlar" },
    ...(groupsData?.data ?? []).map((group) => ({
      value: group.id,
      label: group.name,
    })),
  ];

  const form = useForm<CoinRuleFormValues>({
    resolver: zodResolver(coinRuleFormSchema),
    defaultValues: emptyValues,
  });

  const triggerType = form.watch("triggerType");

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
    toast.error(error?.data?.message || "Xatolik yuz berdi");

  const onSubmit = (values: CoinRuleFormValues) => {
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
            {isEdit ? "Sababni tahrirlash" : "Yangi sabab qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ControlledInput
              name="name"
              control={form.control}
              placeholder="Masalan: Darsga kelgani uchun"
              label="Nomi"
              inputClassName="h-8"
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="coinAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanga miqdori</FormLabel>
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
                label="Yo'nalish"
                options={directionOptions}
                placeholder="Yo'nalishni tanlang"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ControlledSelect
                control={form.control}
                name="triggerType"
                label="Ishga tushirish turi"
                options={triggerTypeOptions}
                placeholder="Turini tanlang"
              />

              {triggerType === "auto" && (
                <ControlledSelect
                  control={form.control}
                  name="sourceType"
                  label="Manba turi"
                  options={sourceTypeOptions}
                  placeholder="Manba turini tanlang"
                />
              )}
            </div>

            <ControlledSelect
              control={form.control}
              name="groupId"
              label="Guruh (Ixtiyoriy)"
              options={groupOptions}
              placeholder="Guruhni tanlang"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh (Ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Qoida haqida qisqacha izoh..."
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
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? "Saqlanmoqda..."
                    : "Yaratilmoqda..."
                  : isEdit
                    ? "Saqlash"
                    : "Yaratish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
