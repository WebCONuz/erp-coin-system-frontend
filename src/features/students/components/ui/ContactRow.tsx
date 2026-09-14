import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const ContactRow = ({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
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
    <div className="flex items-center gap-3 p-2.5 rounded-lg">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-zinc-800 dark:text-zinc-200 truncate">
          {value}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        onClick={handleCopy}
      >
        <Copy size={13} />
      </Button>
    </div>
  );
};
