export const StudentDetailSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
    <div className="h-36 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800"
            />
          ))}
        </div>
        <div className="h-80 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="h-96 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
    </div>
  </div>
);
