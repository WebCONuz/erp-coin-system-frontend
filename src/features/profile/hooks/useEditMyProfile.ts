import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage, getUserConflictField } from "@/ustils/username";
import { createMyProfileSchema, type MyProfileFormValues } from "../schema";
import type { MyProfile, UpdateMyProfileDto } from "../types";
import { useUpdateMyAccount } from "./useHook";

interface Props {
  open: boolean;
  profile?: MyProfile;
  onSuccess?: () => void;
}

const toFormValues = (profile?: MyProfile): MyProfileFormValues => ({
  username: profile?.username ?? "",
  fullName: profile?.fullName ?? "",
  phone: profile?.phone ?? "",
  parentPhone: profile?.parentPhone ?? "",
  email: profile?.email ?? "",
  avatarUrl: profile?.avatarUrl ?? "",
});

export const useEditMyProfile = ({ open, profile, onSuccess }: Props) => {
  const { t } = useTranslation();
  const updateAccount = useUpdateMyAccount();

  const schema = useMemo(() => createMyProfileSchema(t), [t]);
  const form = useForm<MyProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(profile),
  });

  useEffect(() => {
    if (open) form.reset(toFormValues(profile));
  }, [open, profile, form]);

  const onSubmit = (values: MyProfileFormValues) => {
    if (!profile) return;

    // Faqat o'zgargan maydonlar yuboriladi
    const initial = toFormValues(profile);
    const payload: UpdateMyProfileDto = {};
    (Object.keys(values) as (keyof MyProfileFormValues)[]).forEach((key) => {
      const value = values[key] ?? "";
      if (value !== initial[key] && value !== "") payload[key] = value;
    });

    if (!Object.keys(payload).length) {
      onSuccess?.();
      return;
    }

    updateAccount.mutate(payload, {
      onSuccess: (updated) => {
        toast.success(t("profile.updated"));
        if (payload.username) {
          toast.info(
            t("profile.usernameChanged", { username: updated.username }),
          );
        }
        onSuccess?.();
      },
      onError: (error: unknown) => {
        const field = getUserConflictField(error);
        if (field) {
          form.setError(field, {
            message:
              field === "username"
                ? t("username.taken")
                : getApiErrorMessage(error),
          });
          return;
        }
        toast.error(getApiErrorMessage(error) || t("common.error"));
      },
    });
  };

  return {
    form,
    onSubmit,
    isPending: updateAccount.isPending,
  };
};
