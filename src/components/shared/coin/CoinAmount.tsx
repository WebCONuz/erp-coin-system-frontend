import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CoinIcon } from "./CoinIcon";
import { formatCoin } from "./format";

type Size = "sm" | "md" | "lg" | "xl";

interface Props {
  value: number;
  size?: Size;
  /** `pill` — och oltin fonli kapsula (ro'yxatlarda); `plain` — faqat belgi + raqam. */
  variant?: "plain" | "pill";
  /** `+` / `−` belgisini ko'rsatish (tranzaksiyalar uchun). */
  signed?: boolean;
  /** Qiymat o'zgarganda raqam sanab chiqadi va tanga bir marta yaltiraydi. */
  animate?: boolean;
  className?: string;
}

const SIZES: Record<Size, { text: string; icon: string; gap: string }> = {
  sm: { text: "text-xs font-semibold", icon: "size-3.5", gap: "gap-1" },
  md: { text: "text-sm font-semibold", icon: "size-4", gap: "gap-1.5" },
  lg: { text: "font-heading text-2xl font-semibold", icon: "size-6", gap: "gap-2" },
  xl: { text: "font-heading text-4xl font-semibold", icon: "size-8", gap: "gap-2.5" },
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Raqamni `from` dan `to` gacha ~600ms ichida sanab chiqaradi. */
const useCountUp = (to: number, enabled: boolean) => {
  const [active] = useState(() => enabled && !prefersReducedMotion());
  const [display, setDisplay] = useState(active ? 0 : to);
  const fromRef = useRef(active ? 0 : to);

  useEffect(() => {
    if (!active) return;
    const from = fromRef.current;
    if (from === to) return;

    const start = performance.now();
    const duration = 600;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      fromRef.current = to;
    };
  }, [to, active]);

  return active ? display : to;
};

/** Ilovadagi har qanday tanga summasi uchun yagona ko'rinish. */
export const CoinAmount = ({
  value,
  size = "md",
  variant = "plain",
  signed = false,
  animate = false,
  className,
}: Props) => {
  const shown = useCountUp(value, animate);
  const s = SIZES[size];
  const sign = signed ? (value > 0 ? "+" : value < 0 ? "−" : "") : "";
  const abs = signed ? Math.abs(shown) : shown;

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap tabular-nums",
        s.gap,
        s.text,
        variant === "pill" &&
          "rounded-full bg-coin-soft px-2 py-0.5 text-coin-ink",
        className,
      )}
    >
      <CoinIcon
        key={animate ? value : undefined}
        className={cn(s.icon, animate && "motion-safe:animate-coin-shine")}
      />
      <span>
        {sign}
        {formatCoin(abs)}
      </span>
    </span>
  );
};
