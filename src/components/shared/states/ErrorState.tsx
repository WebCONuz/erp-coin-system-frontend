import { CloudOff, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

/** Yuklashda xatolik: nima bo'lganini aytadi va qayta urinish imkonini beradi. */
export const ErrorState = ({
  title,
  description,
  onRetry,
  isRetrying,
  className,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/25 bg-destructive-soft/60 px-4 py-10 text-center",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-destructive-soft text-destructive">
        <CloudOff className="size-5" aria-hidden />
      </span>
      <div className="max-w-sm space-y-1">
        <p className="text-sm font-medium text-foreground">
          {title ?? t("common.loadError.title")}
        </p>
        <p className="text-sm text-muted-foreground">
          {description ?? t("common.loadError.description")}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-1"
        >
          <RotateCw className={cn(isRetrying && "animate-spin")} aria-hidden />
          {t("re_try")}
        </Button>
      )}
    </div>
  );
};
