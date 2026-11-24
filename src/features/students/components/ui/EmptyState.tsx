/** Profil tablari uchun bo'sh holat: chegarali blok ichida umumiy EmptyState. */
export const EmptyState = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-6 py-10 text-center">
    <span
      className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground"
      aria-hidden
    >
      {icon}
    </span>
    <div className="max-w-xs space-y-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  </div>
);
