import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Lock, LockOpen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime, translateApiError } from "@/ustils";
import { useLockSession, useUnlockSession } from "../hooks";
import type { SessionItem } from "../types";
import { SessionDeleteModal } from "./SessionDeleteModal";

interface Props {
  session: SessionItem;
}

export const SessionStatusPanel = ({ session }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lockSession = useLockSession(session.id);
  const unlockSession = useUnlockSession(session.id);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onError = (error: unknown) => toast.error(translateApiError(error, t));

  const handleLock = () => {
    if (!window.confirm(t("sessions.statusPanel.lockConfirm"))) return;

    lockSession.mutate(undefined, {
      onSuccess: () => toast.success(t("sessions.statusPanel.locked")),
      onError,
    });
  };

  const handleUnlock = () => {
    if (!window.confirm(t("sessions.statusPanel.unlockConfirm"))) return;

    unlockSession.mutate(undefined, {
      onSuccess: () => toast.success(t("sessions.statusPanel.unlocked")),
      onError,
    });
  };

  return (
    <div className="flex flex-col gap-2 lg:items-end">
      <div className="flex flex-wrap items-center gap-2">
        {session.isLocked ? (
          <Button
            variant="outline"
            onClick={handleUnlock}
            disabled={unlockSession.isPending}
            className="gap-2"
          >
            <LockOpen className="size-4" aria-hidden />
            {t("sessions.statusPanel.unlockAction")}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleLock}
            disabled={lockSession.isPending}
            className="gap-2"
          >
            <Lock className="size-4" aria-hidden />
            {t("sessions.statusPanel.lockAction")}
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => setIsDeleteOpen(true)}
          className="gap-2 text-destructive hover:bg-destructive-soft hover:text-destructive"
        >
          <Trash className="size-4" aria-hidden />
          {t("common.delete")}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {session.isLocked
          ? `${t("sessions.locked")}${
              session.lockedAt ? `: ${formatDateTime(session.lockedAt)}` : ""
            }`
          : t("sessions.statusPanel.notLocked")}
      </p>

      <SessionDeleteModal
        session={isDeleteOpen ? session : null}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={() => navigate("/admin/sessions")}
      />
    </div>
  );
};
