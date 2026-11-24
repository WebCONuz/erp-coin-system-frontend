import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Archive, KeyRound, Power, ShieldCheck, Trash2 } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/shared/panel";
import { useChangeStudentPassword } from "../../hooks";
import type { ConfirmAction } from "../../types";

export const SecurityTab = ({
  isActive,
  isDeleted,
  setConfirmAction,
}: {
  isActive: boolean;
  isDeleted: boolean;
  setConfirmAction: (action: ConfirmAction) => void;
}) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePassword = useChangeStudentPassword(id ?? "");
  const mismatch = !!newPassword && newPassword !== confirmPassword;

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || mismatch || changePassword.isPending) return;
    changePassword.mutate(
      { newPassword },
      {
        onSuccess: () => {
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  return (
    <TabsContent value="security" className="mt-4 space-y-4">
      {/* Parolni almashtirish */}
      <Panel
        title={
          <span className="flex items-center gap-2">
            <KeyRound className="size-4 text-muted-foreground" aria-hidden />
            {t("students.securityTab.changePasswordTitle")}
          </span>
        }
      >
        <form onSubmit={submitPassword} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="student-new-password"
                className="text-sm font-medium"
              >
                {t("students.securityTab.newPasswordLabel")}
              </label>
              <Input
                id="student-new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("students.securityTab.newPasswordPlaceholder")}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="student-confirm-password"
                className="text-sm font-medium"
              >
                {t("students.securityTab.confirmPasswordLabel")}
              </label>
              <Input
                id="student-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t(
                  "students.securityTab.confirmPasswordPlaceholder",
                )}
                aria-invalid={mismatch || undefined}
                aria-describedby={mismatch ? "student-password-error" : undefined}
                className="h-10"
              />
            </div>
          </div>
          {mismatch && (
            <p
              id="student-password-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {t("students.securityTab.passwordMismatch")}
            </p>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newPassword || mismatch || changePassword.isPending}
              className="h-10 gap-2 px-4"
            >
              <ShieldCheck className="size-4" aria-hidden />
              {changePassword.isPending
                ? t("common.saving")
                : t("students.securityTab.changePasswordTitle")}
            </Button>
          </div>
        </form>
      </Panel>

      {/* Xavfli amallar: arxivlash va o'chirish */}
      <section
        aria-labelledby="student-danger-zone"
        className="space-y-3 rounded-2xl border border-destructive/30 bg-card p-4 sm:p-5"
      >
        <h3
          id="student-danger-zone"
          className="font-heading text-base font-semibold text-destructive"
        >
          {t("students.securityTab.dangerZone")}
        </h3>

        <DangerRow
          icon={isActive ? Archive : Power}
          title={
            isActive
              ? t("students.actions.archiveTitle")
              : t("students.actions.restoreTitle")
          }
          description={
            isActive
              ? t("students.securityTab.archiveDesc")
              : t("students.securityTab.activateDesc")
          }
          action={
            <Button
              variant="outline"
              onClick={() => setConfirmAction(isActive ? "archive" : "restore")}
              disabled={isDeleted}
              className="w-full gap-2 sm:w-auto"
            >
              {isActive ? (
                <Archive className="size-4" aria-hidden />
              ) : (
                <Power className="size-4" aria-hidden />
              )}
              {isActive
                ? t("students.detail.archive")
                : t("students.detail.activate")}
            </Button>
          }
        />

        <DangerRow
          icon={Trash2}
          title={t("students.actions.deleteTitle")}
          description={t("students.securityTab.deleteDesc")}
          action={
            <Button
              variant="outline"
              disabled={isDeleted}
              onClick={() => setConfirmAction("delete")}
              className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive-soft hover:text-destructive sm:w-auto"
            >
              <Trash2 className="size-4" aria-hidden />
              {isDeleted ? t("students.status.deleted") : t("common.delete")}
            </Button>
          }
        />
      </section>
    </TabsContent>
  );
};

const DangerRow = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Trash2;
  title: string;
  description: string;
  action: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="shrink-0">{action}</div>
  </div>
);
