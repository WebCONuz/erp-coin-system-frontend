import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BackListButton = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="-ml-2 h-9 gap-2 px-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {title}
      </Button>
    </div>
  );
};
