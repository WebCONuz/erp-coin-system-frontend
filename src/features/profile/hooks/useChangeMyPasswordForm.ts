import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage, getApiErrorStatus } from "@/ustils/username";
import {
  createChangeMyPasswordSchema,
  type ChangeMyPasswordFormValues,
} from "../schema";
import { useChangeMyPassword } from "./useHook";

interface Props {
  open: boolean;
  userId: string;
  onSuccess?: () => void;
}

const emptyValues: ChangeMyPasswordFormValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const useChangeMyPasswordForm = ({ open, userId, onSuccess }: Props) => {
  const { t } = useTranslation();
  const changePassword = useChangeMyPassword(userId);

  const schema = useMemo(() => createChangeMyPasswordSchema(t), [t]);
  const form = useForm<ChangeMyPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) form.reset(emptyValues);
  }, [open, form]);

  const onSubmit = (values: ChangeMyPasswordFormValues) => {
    changePassword.mutate(
      { oldPassword: values.oldPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success(t("profile.passwordChanged"));
          form.reset(emptyValues);
          onSuccess?.();
        },
        onError: (error: unknown) => {
          // 403 — eski parol noto'g'ri: xatoni input ostida ko'rsatamiz
          if (getApiErrorStatus(error) === 403) {
            form.setError("oldPassword", {
              message: getApiErrorMessage(error) || t("common.error"),
            });
            return;
          }
          toast.error(getApiErrorMessage(error) || t("common.error"));
        },
      },
    );
  };

  return {
    form,
    onSubmit,
    isPending: changePassword.isPending,
  };
};
