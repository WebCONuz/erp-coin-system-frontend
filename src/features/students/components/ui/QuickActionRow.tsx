export const QuickActionRow = ({
  icon,
  iconBg,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
  >
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
    >
      {icon}
    </div>
    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label}
    </span>
  </button>
);
