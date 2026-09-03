import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCoinRule } from "@/features/coin-rules/hooks";
import {
  directionOptions,
  sourceTypeOptions,
  triggerTypeOptions,
} from "@/features/coin-rules/constants";
import type {
  CoinRuleDirection,
  CoinRuleSourceType,
  CoinRuleTriggerType,
} from "@/features/coin-rules/types";
import { useMyTaughtGroups } from "../../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateCoinRuleModal = ({ open, onClose }: Props) => {
  const { data: groups } = useMyTaughtGroups();
  const createRule = useCreateCoinRule();

  const [name, setName] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [direction, setDirection] = useState<CoinRuleDirection>("earn");
  const [triggerType, setTriggerType] = useState<CoinRuleTriggerType>("manual");
  const [sourceType, setSourceType] = useState<CoinRuleSourceType | "">("");
  const [groupId, setGroupId] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setName("");
    setCoinAmount("");
    setDirection("earn");
    setTriggerType("manual");
    setSourceType("");
    setGroupId("");
    setDescription("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const amount = Number(coinAmount);
    if (!name.trim()) {
      toast.error("Qoida nomini kiriting");
      return;
    }
    if (!amount || amount < 1) {
      toast.error("Tanga miqdorini to'g'ri kiriting");
      return;
    }
    if (!groupId) {
      toast.error("Guruhni tanlang");
      return;
    }
    if (triggerType === "auto" && !sourceType) {
      toast.error("Manba turini tanlang");
      return;
    }

    createRule.mutate(
      {
        name: name.trim(),
        coinAmount: amount,
        direction,
        triggerType,
        sourceType:
          triggerType === "auto" ? (sourceType as CoinRuleSourceType) : undefined,
        description: description || undefined,
        groupId,
      },
      {
        onSuccess: () => {
          toast.success("Qoida yaratildi");
          handleClose();
        },
        onError: (error: any) =>
          toast.error(error?.data?.message || "Xatolik yuz berdi"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-ink">
            Yangi tanga qoidasi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-medium text-ink-soft mb-1.5 block">
              Nomi
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Darsga faol qatnashgani uchun"
              className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-soft mb-1.5 block">
                Tanga miqdori
              </label>
              <input
                type="number"
                min={1}
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
                placeholder="10"
                className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-soft mb-1.5 block">
                Yo'nalish
              </label>
              <Select
                value={direction}
                onValueChange={(v) => setDirection(v as CoinRuleDirection)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {directionOptions.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-soft mb-1.5 block">
                Ishga tushirish turi
              </label>
              <Select
                value={triggerType}
                onValueChange={(v) => setTriggerType(v as CoinRuleTriggerType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypeOptions.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {triggerType === "auto" && (
              <div>
                <label className="text-xs font-medium text-ink-soft mb-1.5 block">
                  Manba turi
                </label>
                <Select
                  value={sourceType}
                  onValueChange={(v) => setSourceType(v as CoinRuleSourceType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceTypeOptions.map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-ink-soft mb-1.5 block">
              Guruh
            </label>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Guruhni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {(groups ?? []).map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-soft mb-1.5 block">
              Izoh (ixtiyoriy)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Qoida haqida qisqacha izoh..."
              className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold/50 resize-none h-20"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={createRule.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
          >
            {createRule.isPending ? "Yaratilmoqda..." : "Yaratish"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
