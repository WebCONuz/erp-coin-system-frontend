import { cn } from "@/lib/utils";

/** Vaqt chizig'idagi bitta yozuv (`<ol>` ichida). */
export const ActivityItem = ({
  active,
  last,
  label,
  time,
}: {
  active?: boolean;
  last?: boolean;
  label: string;
  time: string;
}) => (
  <li className="flex gap-3">
    <div className="flex flex-col items-center pt-1.5">
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          active ? "bg-primary" : "bg-border",
        )}
        aria-hidden
      />
      {!last && <span className="my-1 w-px flex-1 bg-border" aria-hidden />}
    </div>
    <div className={last ? "pb-0" : "pb-4"}>
      <p className="text-sm">{label}</p>
      <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
        {time}
      </p>
    </div>
  </li>
);
