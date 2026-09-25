import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/controls";
import { useEditMyProfile } from "../hooks";
import type { MyProfile } from "../types";

interface Props {
  open: boolean;
  profile: MyProfile;
  /** Ota-ona telefoni faqat student uchun ko'rsatiladi */
  showParentPhone?: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const EditMyProfileForm = ({
  open,
  profile,
  showParentPhone = false,
  onCancel,
  onSuccess,
}: Props) => {
  const { t } = useTranslation();
  const { form, onSubmit, isPending } = useEditMyProfile({
    open,
    profile,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ControlledInput
            control={form.control}
            name="username"
            label={t("username.label")}
            placeholder={t("username.placeholder")}
            autoCapitalize="none"
            required
          />
          <ControlledInput
            control={form.control}
            name="fullName"
            label={t("profile.form.fullName")}
            placeholder={t("profile.form.fullNamePlaceholder")}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ControlledInput
            control={form.control}
            name="phone"
            label={t("profile.form.phone")}
            placeholder="+998901234567"
            type="tel"
            required
          />
          {showParentPhone ? (
            <ControlledInput
              control={form.control}
              name="parentPhone"
              label={t("profile.form.parentPhone")}
              placeholder="+998901234567"
              type="tel"
            />
          ) : (
            <ControlledInput
              control={form.control}
              name="email"
              label={t("profile.form.email")}
              placeholder="email@example.com"
              type="email"
            />
          )}
        </div>

        {showParentPhone && (
          <ControlledInput
            control={form.control}
            name="email"
            label={t("profile.form.email")}
            placeholder="email@example.com"
            type="email"
          />
        )}

        <ControlledInput
          control={form.control}
          name="avatarUrl"
          label={t("profile.form.avatarUrl")}
          placeholder="https://example.com/avatar.jpg"
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
