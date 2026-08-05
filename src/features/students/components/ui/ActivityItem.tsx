import { Clock } from "lucide-react";

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
  <div className="flex gap-3">
    <div className="flex flex-col items-center pt-0.5">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-purple-600" : "bg-zinc-300 dark:bg-zinc-600"}`}
      />
      {!last && (
        <span className="w-px flex-1 bg-zinc-200 dark:bg-zinc-700 my-1" />
      )}
    </div>
    <div className={last ? "pb-0" : "pb-4"}>
      <p className="text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
        <Clock size={11} className="text-zinc-400" />
        {label}
      </p>
      <p className="text-xs text-zinc-400 mt-0.5">{time}</p>
    </div>
  </div>
);
