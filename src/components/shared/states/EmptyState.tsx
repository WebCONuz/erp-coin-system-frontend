import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Keyingi qadam — odatda bitta tugma yoki havola. */
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

/** Bo'sh ro'yxat/bo'lim: nima bo'lganini va keyingi qadamni aytadi. */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: Props) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center text-center",
      size === "md" ? "gap-3 px-4 py-10" : "gap-2 px-3 py-6",
      className,
    )}
  >
    {Icon && (
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-muted text-muted-foreground",
          size === "md" ? "size-11" : "size-9",
        )}
      >
        <Icon className={size === "md" ? "size-5" : "size-4"} aria-hidden />
      </span>
    )}
    <div className="max-w-xs space-y-1">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {action}
  </div>
);
