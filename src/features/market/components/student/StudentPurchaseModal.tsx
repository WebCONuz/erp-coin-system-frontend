import { useEffect, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Check,
  Coins,
  Gift,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn, getFileUrl } from "@/lib/utils";
import type { Reward } from "../../types";

// Tasodifiy bosib yuborishning oldini olish uchun xarid tugmasini
// shuncha vaqt bosib turish kerak.
const HOLD_MS = 1200;

interface Props {
  reward: Reward | null;
  balance: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  isSuccess: boolean;
  remainingCoins?: number;
  successMessage?: string;
  onGoToPurchases: () => void;
}

export const StudentPurchaseModal = ({
  reward,
  balance,
  open,
  onOpenChange,
  onConfirm,
  isPending,
  isSuccess,
  remainingCoins,
  successMessage,
  onGoToPurchases,
}: Props) => {
  const handleOpenChange = (next: boolean) => {
    // So'rov ketayotganda modal yopilib qolmasin.
    if (isPending) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden bg-white p-0 text-ink ring-ink/10 sm:max-w-md rounded-3xl"
      >
        {reward &&
          (isSuccess ? (
            <SuccessView
              reward={reward}
              remainingCoins={remainingCoins ?? balance - reward.coinPrice}
              message={successMessage}
              onGoToPurchases={onGoToPurchases}
            />
          ) : (
            <ConfirmView
              reward={reward}
              balance={balance}
              isPending={isPending}
              onConfirm={onConfirm}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
};

const RewardImage = ({ reward }: { reward: Reward }) => (
  <div className="relative mx-auto h-36 w-36 sm:h-40 sm:w-40">
    <div className="absolute inset-0 rounded-[2rem] bg-gold/30 blur-2xl animate-pulse" />
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border-4 border-white bg-paper-soft shadow-xl shadow-forest/30 rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105">
      {reward.imageUrl ? (
        <img
          src={getFileUrl(reward.imageUrl)}
          alt={reward.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Gift size={48} className="text-gold" />
        </div>
      )}
    </div>
    <Sparkles
      size={20}
      className="absolute -top-2 -left-3 text-gold animate-pulse"
    />
    <Sparkles
      size={14}
      className="absolute -bottom-1 -right-3 text-gold-soft animate-pulse [animation-delay:500ms]"
    />
  </div>
);

const ConfirmView = ({
  reward,
  balance,
  isPending,
  onConfirm,
}: {
  reward: Reward;
  balance: number;
  isPending: boolean;
  onConfirm: () => void;
}) => {
  const { t } = useTranslation();
  const after = balance - reward.coinPrice;
  const spendPercent =
    balance > 0 ? Math.min(100, (reward.coinPrice / balance) * 100) : 100;

  return (
    <>
      {/* Hero */}
      <div className="relative bg-forest px-6 pt-8 pb-10 text-paper">
        <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-bloom/10 blur-3xl" />

        <DialogPrimitive.Close
          disabled={isPending}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-paper/80 transition-colors hover:bg-white/20 disabled:opacity-40"
        >
          <X size={16} />
          <span className="sr-only">{t("common.close")}</span>
        </DialogPrimitive.Close>

        <p className="relative mb-5 text-center text-xs font-semibold uppercase tracking-wide text-gold">
          {t("market.purchaseModal.chosen")}
        </p>
        <RewardImage reward={reward} />
      </div>

      <div className="-mt-5 relative rounded-t-3xl bg-white px-5 pt-5 pb-5 sm:px-6">
        <DialogPrimitive.Title className="font-display text-xl font-semibold text-center text-ink">
          {reward.title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="mt-1 text-center text-xs text-ink-soft line-clamp-2">
          {reward.description || t("market.purchaseModal.defaultDescription")}
        </DialogPrimitive.Description>

        {/* Balance breakdown */}
        <div className="mt-5 rounded-2xl border border-ink/10 bg-paper-soft p-4">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-forest/10">
            <div
              className="h-full bg-gold transition-all duration-700"
              style={{ width: `${spendPercent}%` }}
            />
            <div className="h-full flex-1 bg-forest/70" />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-ink-soft">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-gold" />
              {t("market.purchaseModal.spent")}
            </span>
            <span className="flex items-center gap-1">
              {t("market.purchaseModal.left")}
              <span className="h-2 w-2 rounded-full bg-forest/70" />
            </span>
          </div>

          <dl className="mt-3 space-y-2 text-sm">
            <Row label={t("market.purchaseModal.balance")} value={balance} />
            <Row
              label={t("market.purchaseModal.price")}
              value={`−${reward.coinPrice}`}
              valueClassName="text-bloom"
            />
            <div className="border-t border-dashed border-ink/15" />
            <Row
              label={t("market.purchaseModal.after")}
              value={after}
              valueClassName="text-forest text-base font-bold"
            />
          </dl>
        </div>

        <HoldToConfirmButton
          price={reward.coinPrice}
          isPending={isPending}
          onConfirm={onConfirm}
        />

        <DialogPrimitive.Close
          disabled={isPending}
          className="mt-2 w-full rounded-xl py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-soft hover:text-ink disabled:opacity-40"
        >
          {t("common.cancel")}
        </DialogPrimitive.Close>
      </div>
    </>
  );
};

const Row = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number | string;
  valueClassName?: string;
}) => (
  <div className="flex items-center justify-between">
    <dt className="text-ink-soft">{label}</dt>
    <dd
      className={cn(
        "flex items-center gap-1 font-display font-semibold text-ink",
        valueClassName,
      )}
    >
      <Coins size={14} className="text-gold" />
      {value}
    </dd>
  </div>
);

const HoldToConfirmButton = ({
  price,
  isPending,
  onConfirm,
}: {
  price: number;
  isPending: boolean;
  onConfirm: () => void;
}) => {
  const { t } = useTranslation();
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };

  const start = () => {
    if (isPending || timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onConfirm();
    }, HOLD_MS);
  };

  useEffect(() => stop, []);

  return (
    <button
      type="button"
      disabled={isPending}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") stop();
      }}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "relative mt-4 w-full touch-none select-none overflow-hidden rounded-xl bg-forest py-3.5 text-sm font-semibold text-paper transition-transform",
        holding && "scale-[0.98]",
        isPending && "cursor-wait",
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-gold ease-linear"
        style={{
          width: holding || isPending ? "100%" : "0%",
          transitionProperty: "width",
          transitionDuration: holding ? `${HOLD_MS}ms` : "200ms",
        }}
      />
      <span
        className={cn(
          "relative flex items-center justify-center gap-2 transition-colors",
          (holding || isPending) && "text-forest",
        )}
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t("market.purchaseModal.sending")}
          </>
        ) : holding ? (
          t("market.purchaseModal.keepHolding")
        ) : (
          <>
            <Coins size={16} className="text-gold" />
            {t("market.purchaseModal.holdToBuy", { price })}
          </>
        )}
      </span>
    </button>
  );
};

const SuccessView = ({
  reward,
  remainingCoins,
  message,
  onGoToPurchases,
}: {
  reward: Reward;
  remainingCoins: number;
  message?: string;
  onGoToPurchases: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative px-6 pt-10 pb-6 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold/15 to-transparent" />

      <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-forest/20 animate-ping" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-forest text-paper shadow-lg animate-in zoom-in-50 duration-500">
          <Check size={36} strokeWidth={3} />
        </span>
      </div>

      <DialogPrimitive.Title className="relative mt-5 font-display text-2xl font-semibold text-ink animate-in fade-in slide-in-from-bottom-2 duration-500">
        {t("market.purchaseModal.successTitle")}
      </DialogPrimitive.Title>
      <DialogPrimitive.Description className="relative mt-1.5 text-sm text-ink-soft">
        <span className="font-semibold text-ink">{reward.title}</span>
        {" — "}
        {message || t("market.purchaseModal.successText")}
      </DialogPrimitive.Description>

      <div className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-paper-soft px-4 py-2 text-sm text-ink-soft">
        {t("market.purchaseModal.remaining")}
        <span className="flex items-center gap-1 font-display font-bold text-forest">
          <Coins size={14} className="text-gold" />
          {remainingCoins}
        </span>
      </div>

      <button
        type="button"
        onClick={onGoToPurchases}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-3 text-sm font-semibold text-paper transition-colors hover:bg-forest-light"
      >
        {t("market.purchaseModal.goToPurchases")}
        <ArrowRight size={16} />
      </button>
      <DialogPrimitive.Close className="mt-2 w-full rounded-xl py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-soft hover:text-ink">
        {t("market.purchaseModal.continueShopping")}
      </DialogPrimitive.Close>
    </div>
  );
};
