import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BackListButton = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Button
        variant="outline"
        // size="sm"
        onClick={() => navigate(-1)}
        className="gap-2 px-4 h-10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="w-4 h-4" />
        {title}
      </Button>
    </div>
  );
};
