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
  confirmLabel = "Tasdiqlash",
  variant = "danger",
  isPending = false,
}: ConfirmModalProps) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="sm:max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <DialogHeader>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1 ${variant === "danger" ? "bg-red-100 dark:bg-red-950/50" : "bg-amber-100 dark:bg-amber-950/50"}`}
        >
          <AlertTriangle
            size={22}
            className={
              variant === "danger"
                ? "text-red-600 dark:text-red-400"
                : "text-amber-600 dark:text-amber-400"
            }
          />
        </div>
        <DialogTitle className="text-zinc-900 dark:text-zinc-50">
          {title}
        </DialogTitle>
      </DialogHeader>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 -mt-2">
        {description}
      </p>
      <DialogFooter className="gap-2 mt-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isPending}
          className="border-zinc-300 dark:border-zinc-700"
        >
          Bekor qilish
        </Button>
        <Button
          disabled={isPending}
          onClick={onConfirm}
          className={
            variant === "danger"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }
        >
          {isPending ? "..." : confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
