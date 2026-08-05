export const InfoField = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-500 dark:text-zinc-400 mt-0.5">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-zinc-400 dark:text-zinc-500">{label}</p>
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 wrap-break-word">
        {value}
      </p>
    </div>
  </div>
);
