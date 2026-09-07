import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
  directionOptions,
  sourceTypeOptions,
  triggerTypeOptions,
} from "@/features/coin-rules/constants";
import {
  coinRuleFormSchema,
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
  const { data: groups } = useMyTaughtGroups();
  const createRule = useCreateCoinRule();

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
      toast.error("Guruhni tanlang");
      return;
    }
    if (values.triggerType === "auto" && !values.sourceType) {
      toast.error("Manba turini tanlang");
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
          toast.success("Qoida yaratildi");
          onClose();
        },
        onError: (error: any) =>
          toast.error(error?.data?.message || "Xatolik yuz berdi"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-ink">
            Yangi tanga qoidasi
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
              label="Nomi"
              placeholder="Masalan: Darsga faol qatnashgani uchun"
              inputClassName="h-8"
            />

            <ControlledInput
              control={form.control}
              name="coinAmount"
              label="Tanga miqdori"
              placeholder="10"
              isNumber
              inputClassName="h-8"
            />

            <div className="grid grid-cols-2 gap-3">
              <ControlledSelect
                control={form.control}
                name="direction"
                label="Yo'nalish"
                options={directionOptions}
              />
              <ControlledSelect
                control={form.control}
                name="triggerType"
                label="Ishga tushirish turi"
                options={triggerTypeOptions}
              />

              {triggerType === "auto" && (
                <ControlledSelect
                  control={form.control}
                  name="sourceType"
                  label="Manba turi"
                  options={sourceTypeOptions}
                  placeholder="Tanlang"
                />
              )}
            </div>

            <ControlledSelect
              control={form.control}
              name="groupId"
              label="Guruh"
              options={(groups ?? []).map((g) => ({
                value: g.id,
                label: g.name,
              }))}
              placeholder="Guruhni tanlang"
              required
            />

            <ControlledTextarea
              control={form.control}
              name="description"
              label="Izoh (ixtiyoriy)"
              placeholder="Qoida haqida qisqacha izoh..."
              className="resize-none h-20"
            />

            <button
              type="submit"
              disabled={createRule.isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
            >
              {createRule.isPending ? "Yaratilmoqda..." : "Yaratish"}
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
