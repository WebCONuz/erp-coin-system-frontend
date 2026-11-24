import { Skeleton } from "@/components/ui/skeleton";

export const StudentDetailSkeleton = () => (
  <div aria-busy="true" className="space-y-4 sm:space-y-5">
    <Skeleton className="h-9 w-32" />
    <Skeleton className="h-28 rounded-2xl" />
    <Skeleton className="h-24 rounded-2xl" />
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  </div>
);
