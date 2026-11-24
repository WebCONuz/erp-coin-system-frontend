import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/**
 * Edu-game tangasi — butun ilovada tanga uchun yagona belgi.
 * Bezak: har doim yonida raqam bo'ladi, shuning uchun `aria-hidden`.
 */
export const CoinIcon = ({ className }: Props) => (
  <svg
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
    className={cn("size-4 shrink-0", className)}
  >
    <circle cx="10" cy="10" r="9" fill="var(--coin)" />
    <circle
      cx="10"
      cy="10"
      r="6.4"
      fill="none"
      stroke="var(--coin-ink)"
      strokeOpacity="0.35"
      strokeWidth="1.2"
    />
    {/* Barg — "bog'" yo'nalishining belgisi */}
    <path
      d="M6.8 13.2C6.8 9.3 9.3 6.8 13.2 6.8c0 3.9-2.5 6.4-6.4 6.4Z"
      fill="var(--coin-ink)"
      fillOpacity="0.55"
    />
  </svg>
);
