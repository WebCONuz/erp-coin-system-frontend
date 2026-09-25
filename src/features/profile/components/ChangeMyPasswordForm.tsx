import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/controls";
import { useChangeMyPasswordForm } from "../hooks";

interface Props {
  open: boolean;
  userId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const ChangeMyPasswordForm = ({
  open,
  userId,
  onCancel,
  onSuccess,
}: Props) => {
  const { t } = useTranslation();
  const { form, onSubmit, isPending } = useChangeMyPasswordForm({
    open,
    userId,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ControlledInput
          control={form.control}
          name="oldPassword"
          label={t("profile.form.oldPassword")}
          placeholder="••••••••"
          type="password"
          autoComplete="current-password"
          required
        />
        <ControlledInput
          control={form.control}
          name="newPassword"
          label={t("profile.form.newPassword")}
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
          required
        />
        <ControlledInput
          control={form.control}
          name="confirmPassword"
          label={t("profile.form.confirmPassword")}
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
          required
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
