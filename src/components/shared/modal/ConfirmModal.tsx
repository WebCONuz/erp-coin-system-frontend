import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  isPending?: boolean;
}

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = "danger",
  isPending = false,
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm bg-card border border-border">
        <DialogHeader>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1 ${variant === "danger" ? "bg-destructive-soft" : "bg-warning-soft"}`}
          >
            <AlertTriangle
              size={22}
              className={
                variant === "danger"
                  ? "text-destructive"
                  : "text-warning"
              }
            />
          </div>
          <DialogTitle className="text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          {description}
        </p>
        <DialogFooter className="gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="border-border"
          >
            {t("common.cancel")}
          </Button>
          <Button
            disabled={isPending}
            onClick={onConfirm}
            className={
              variant === "danger"
                ? "bg-destructive hover:bg-destructive/90 text-white"
                : "bg-warning hover:bg-warning/90 text-white"
            }
          >
            {isPending ? "..." : (confirmLabel ?? t("common.confirm"))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
