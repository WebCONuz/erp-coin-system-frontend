import { useTranslation } from "react-i18next";
import { Copy, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const ContactRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => {
  const { t } = useTranslation();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("students.contactRow.copied"));
    } catch {
      toast.error(t("students.contactRow.copyFailed"));
    }
  };

  return (
    <li className="flex items-center gap-3 rounded-xl px-2 py-2">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium tabular-nums">{value}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={handleCopy}
        aria-label={t("students.contactRow.copy", { label })}
      >
        <Copy className="size-4" aria-hidden />
      </Button>
    </li>
  );
};
