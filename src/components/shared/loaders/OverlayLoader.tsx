import { Loader2 } from "lucide-react";

export const OverlayLoader = () => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  );
};
