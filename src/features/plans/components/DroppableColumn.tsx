import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { Weekday } from "../types";

interface Props {
  weekday: Weekday;
  children: ReactNode;
  className?: string;
}

export const DroppableColumn = ({ weekday, children, className }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: weekday });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 rounded-xl bg-muted/50 p-2 transition-colors",
        isOver && "bg-primary-soft ring-2 ring-primary/40",
        className,
      )}
    >
      {children}
    </section>
  );
};
