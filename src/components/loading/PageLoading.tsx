import { Loader2 } from "lucide-react";

export const PageLoading = () => {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center bg-background rounded-xl">
      <Loader2 className="text-violet-600 dark:text-gray-200 w-8 h-8 animate-spin" />
    </div>
  );
};
