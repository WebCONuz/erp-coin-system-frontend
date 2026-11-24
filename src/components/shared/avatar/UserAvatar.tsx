import { cn, getFileUrl } from "@/lib/utils";

interface Props {
  name: string;
  url?: string | null;
  /** Oltin halqa (masalan, reytingda 1-o'rin). */
  highlight?: boolean;
  className?: string;
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("") || "?";

/** Foydalanuvchi avatari: rasm (nisbiy yo'l ham) yoki bosh harflar. */
export const UserAvatar = ({ name, url, highlight, className }: Props) => {
  const src = getFileUrl(url);
  const ring = highlight
    ? "ring-2 ring-coin ring-offset-2 ring-offset-card"
    : "";

  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        className={cn(
          "size-9 shrink-0 rounded-full object-cover",
          ring,
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary",
        ring,
        className,
      )}
    >
      {initials(name)}
    </span>
  );
};
