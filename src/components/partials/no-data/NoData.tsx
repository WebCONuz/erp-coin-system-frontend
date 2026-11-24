import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoDataProps {
  text: string;
  /** Eski API: balandlik klassi. Yangi kodda `EmptyState` ishlatiladi. */
  height?: string;
  children?: ReactNode;
}

/** Eski bo'sh holat — yangi `EmptyState` uslubida (chegarali blok). */
export const NoData = ({ text, height = "min-h-48", children }: NoDataProps) => {
  return (
    <div
      className={cn(
        height,
        "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-4 py-10 text-center",
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="size-5" aria-hidden />
      </span>
      <p className="max-w-xs text-sm font-medium text-foreground">{text}</p>
      {children}
    </div>
  );
};
