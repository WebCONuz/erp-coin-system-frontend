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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { ROLES } from "@/assets/constants";
import { createRoleFormSchema, type RoleFormValues } from "../schema";
import { useCreateRole, useUpdateRole } from "../hooks";
import type { Role } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  role?: Role;
}

const emptyValues: RoleFormValues = {
  name: "",
  displayName: "",
  level: 0,
  scope: "tenant",
  canDelete: false,
};

export const RoleFormModal = ({ open, onClose, mode, role }: Props) => {
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const { user } = useAuth();
  const canSetCanDelete =
    user?.role.name === ROLES.SUPER_ADMIN || user?.role.name === ROLES.CREATOR;

  const createRole = useCreateRole();
  const updateRole = useUpdateRole(role?.id ?? "");
  const isPending = createRole.isPending || updateRole.isPending;

  const roleFormSchema = useMemo(() => createRoleFormSchema(t), [t]);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && role) {
      form.reset({
        name: role.name,
        displayName: role.displayName,
        level: role.level,
        scope: role.scope,
        canDelete: role.canDelete,
      });
    } else {
      form.reset(emptyValues);
    }
  }, [open, isEdit, role, form]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

  const onSubmit = (values: RoleFormValues) => {
    const data = canSetCanDelete ? values : { ...values, canDelete: undefined };

    if (isEdit && role) {
      updateRole.mutate(data, { onSuccess: () => onClose(), onError });
    } else {
      createRole.mutate(data, { onSuccess: () => onClose(), onError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? t("roles.form.editTitle") : t("roles.form.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("roles.form.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("roles.form.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("roles.form.displayNameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("roles.form.displayNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("roles.form.levelLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("roles.form.scopeLabel")}</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="tenant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {canSetCanDelete && (
              <FormField
                control={form.control}
                name="canDelete"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mt-0!">
                      {t("roles.form.canDeleteLabel")}
                    </FormLabel>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? t("common.saving")
                    : t("common.creating")
                  : isEdit
                    ? t("common.save")
                    : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
