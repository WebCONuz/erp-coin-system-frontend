import { useState } from "react";
import { toast } from "sonner";
import { Coins, Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManualCoinTransaction, useStudentById } from "@/features/students/hooks";
import { useMyTaughtGroups } from "../../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  defaultGroupId?: string;
}

export const GiveCoinModal = ({
  open,
  onClose,
  studentId,
  studentName,
  defaultGroupId,
}: Props) => {
  const { data: myGroups } = useMyTaughtGroups();
  const { data: student } = useStudentById(open ? studentId : "");
  const manualCoin = useManualCoinTransaction(studentId);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [direction, setDirection] = useState<"earn" | "deduct">("earn");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const myGroupIds = new Set((myGroups ?? []).map((g) => g.id));
  const matchingGroups = (student?.groupMemberships ?? [])
    .filter((gm) => myGroupIds.has(gm.group.id))
    .map((gm) => gm.group);

  const effectiveGroupId =
    selectedGroupId ||
    defaultGroupId ||
    (matchingGroups.length === 1 ? matchingGroups[0].id : "");

  const reset = () => {
    setAmount("");
    setNote("");
    setDirection("earn");
    setSelectedGroupId("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1) {
      toast.error("Miqdorni to'g'ri kiriting");
      return;
    }
    if (!effectiveGroupId) {
      toast.error("Guruhni tanlang");
      return;
    }

    manualCoin.mutate(
      {
        studentId,
        amount: numAmount,
        direction,
        sourceType: "manual",
        note: note || undefined,
        groupId: effectiveGroupId,
      },
      {
        onSuccess: () => {
          toast.success("Tanga muvaffaqiyatli berildi");
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
            Tanga berish
          </DialogTitle>
          <DialogDescription className="text-ink-soft">
            {studentName}ga coin qo'shing yoki ayiring
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDirection("earn")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                direction === "earn"
                  ? "border-forest/40 bg-forest/10 text-forest"
                  : "border-ink/10 text-ink-soft"
              }`}
            >
              <Plus size={15} />
              Qo'shish
            </button>
            <button
              type="button"
              onClick={() => setDirection("deduct")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                direction === "deduct"
                  ? "border-bloom/40 bg-bloom/10 text-bloom"
                  : "border-ink/10 text-ink-soft"
              }`}
            >
              <Minus size={15} />
              Ayirish
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-soft mb-1.5 block">
              Miqdor
            </label>
            <div className="relative">
              <Coins
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gold"
              />
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Masalan: 15"
                className="w-full rounded-xl border border-ink/10 bg-white pl-9 pr-3 py-2.5 text-sm text-ink outline-none focus:border-gold/50"
              />
            </div>
          </div>

          {matchingGroups.length > 1 && (
            <div>
              <label className="text-xs font-medium text-ink-soft mb-1.5 block">
                Guruh
              </label>
              <Select value={effectiveGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Guruhni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {matchingGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-ink-soft mb-1.5 block">
              Sabab (ixtiyoriy)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Masalan: Olimpiadada faol ishtirok etgani uchun"
              className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold/50"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={manualCoin.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
          >
            {manualCoin.isPending ? "Yuborilmoqda..." : "Tasdiqlash"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
