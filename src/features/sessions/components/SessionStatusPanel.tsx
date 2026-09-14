import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Lock, LockOpen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/ustils";
import {
  useDeleteSession,
  useLockSession,
  useUnlockSession,
} from "../hooks";
import type { SessionItem } from "../types";

interface Props {
  session: SessionItem;
}

export const SessionStatusPanel = ({ session }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lockSession = useLockSession(session.id);
  const unlockSession = useUnlockSession(session.id);
  const deleteSession = useDeleteSession();

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

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

  const handleDelete = () => {
    if (!window.confirm(t("sessions.statusPanel.deleteConfirm"))) return;

    deleteSession.mutate(session.id, {
      onSuccess: () => {
        toast.success(t("sessions.statusPanel.deleted"));
        navigate("/admin/sessions");
      },
      onError,
    });
  };

  return (
    <div className="rounded-2xl bg-background p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {session.isLocked ? (
            <span className="flex items-center gap-1.5">
              <Lock size={14} />
              {t("sessions.locked")}
              {session.lockedAt && ` — ${formatDateTime(session.lockedAt)}`}
            </span>
          ) : (
            <span>{t("sessions.statusPanel.notLocked")}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {session.isLocked ? (
            <Button
              variant="outline"
              onClick={handleUnlock}
              disabled={unlockSession.isPending}
              className="gap-2"
            >
              <LockOpen size={16} />
              {t("sessions.statusPanel.unlockAction")}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleLock}
              disabled={lockSession.isPending}
              className="gap-2"
            >
              <Lock size={16} />
              {t("sessions.statusPanel.lockAction")}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleteSession.isPending}
            className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/50"
          >
            <Trash size={16} />
            {t("common.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
};
