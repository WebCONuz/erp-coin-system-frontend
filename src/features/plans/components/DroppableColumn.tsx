import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { Weekday } from "../types";

interface Props {
  weekday: Weekday;
  children: ReactNode;
}

export const DroppableColumn = ({ weekday, children }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: weekday });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 rounded-lg p-1 transition-colors",
        isOver && "bg-primary/5 ring-2 ring-primary/40",
      )}
    >
      {children}
    </div>
  );
};
