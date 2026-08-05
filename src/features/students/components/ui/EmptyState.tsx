import { Button } from "@/components/ui/button";

export const EmptyState = ({
  icon,
  title,
  text,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  actionLabel?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400 dark:text-zinc-600">
      {icon}
    </div>
    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
      {title}
    </p>
    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs">
      {text}
    </p>
    {actionLabel && (
      <Button
        variant="outline"
        size="sm"
        className="mt-4 border-zinc-300 dark:border-zinc-700"
      >
        {actionLabel}
      </Button>
    )}
  </div>
);
