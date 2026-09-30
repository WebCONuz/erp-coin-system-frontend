import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/shared/modal";
import { getApiErrorData, translateApiError } from "@/ustils";
import { useDeleteSession } from "../hooks";
import type { SessionItem } from "../types";

interface Props {
  /** `null` — modal yopiq. */
  session: SessionItem | null;
  onClose: () => void;
  onDeleted?: () => void;
}

/**
 * Sessiya o'chirilganda uning tekshiruvi orqali berilgan coinlar qaytariladi.
 * Kimdir coinni sarflab bo'lgan bo'lsa backend `409 SESSION_COINS_SPENT`
 * qaytaradi — shunda "coinlarni qaytarmasdan o'chirish" (`?keepCoins=true`)
 * taklif qilinadi.
 */
export const SessionDeleteModal = ({ session, onClose, onDeleted }: Props) => {
  const { t } = useTranslation();
  const deleteSession = useDeleteSession();
  /** Coinni sarflagan o'quvchilar soni; `null` — oddiy o'chirish bosqichi. */
  const [spentCount, setSpentCount] = useState<number | null>(null);
  const keepCoins = spentCount !== null;

  const handleClose = () => {
    setSpentCount(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!session) return;

    deleteSession.mutate(
      { id: session.id, keepCoins },
      {
        onSuccess: () => {
          toast.success(t("sessions.statusPanel.deleted"));
          handleClose();
          onDeleted?.();
        },
        onError: (error) => {
          const data = getApiErrorData(error);
          if (!keepCoins && data?.code === "SESSION_COINS_SPENT") {
            setSpentCount(data.studentIds?.length ?? 0);
            return;
          }
          toast.error(translateApiError(error, t));
        },
      },
    );
  };

  return (
    <ConfirmModal
      open={!!session}
      onClose={handleClose}
      onConfirm={handleConfirm}
      isPending={deleteSession.isPending}
      variant={keepCoins ? "warning" : "danger"}
      title={
        keepCoins
          ? t("sessions.delete.coinsSpentTitle")
          : t("sessions.delete.title")
      }
      description={
        keepCoins
          ? t("sessions.delete.coinsSpentDescription", { total: spentCount })
          : `${t("sessions.deleteConfirm", {
              group: session?.group.name,
              time: session?.startTime,
            })} ${t("sessions.delete.coinsReversedHint")}`
      }
      confirmLabel={
        keepCoins ? t("sessions.delete.keepCoinsAction") : t("common.delete")
      }
    />
  );
};
