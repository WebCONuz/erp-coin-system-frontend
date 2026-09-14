import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/controls";
import {
  createChangeTeacherPasswordSchema,
  type ChangeTeacherPasswordFormValues,
} from "../../schema";
import { useChangeTeacherPassword } from "../../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  teacherId: string;
}

export const ChangePasswordModal = ({ open, onClose, teacherId }: Props) => {
  const { t } = useTranslation();
  const changePassword = useChangeTeacherPassword(teacherId);

  const changeTeacherPasswordSchema = useMemo(
    () => createChangeTeacherPasswordSchema(t),
    [t],
  );

  const form = useForm<ChangeTeacherPasswordFormValues>({
    resolver: zodResolver(changeTeacherPasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ oldPassword: "", newPassword: "" });
    }
  }, [open, form]);

  const onSubmit = (values: ChangeTeacherPasswordFormValues) => {
    changePassword.mutate(
      {
        newPassword: values.newPassword,
        oldPassword: values.oldPassword || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("teachers.passwordChanged"));
          onClose();
        },
        onError: (error: any) =>
          toast.error(error?.data?.message || t("common.error")),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>{t("teachers.securityTab.changePasswordTitle")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ControlledInput
              control={form.control}
              name="oldPassword"
              label={t("teachers.currentPasswordLabel")}
              placeholder={t("teachers.currentPasswordPlaceholder")}
              type="password"
            />
            <ControlledInput
              control={form.control}
              name="newPassword"
              label={t("students.securityTab.newPasswordLabel")}
              placeholder={t("students.securityTab.newPasswordPlaceholder")}
              type="password"
            />

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={changePassword.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending
                  ? t("common.saving")
                  : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
