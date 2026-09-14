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
import { ControlledSelect } from "@/components/controls";
import { createTenantFormSchema, type TenantFormValues } from "../schema";
import { useCreateTenant, useUpdateTenant } from "../hooks";
import { getTenantTypeOptions } from "../constants";
import type { TenentType } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  tenant?: TenentType;
}

const emptyValues: TenantFormValues = {
  name: "",
  slug: "",
  plan: "",
  type: "",
};

export const TenantFormModal = ({ open, onClose, mode, tenant }: Props) => {
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant(tenant?.id ?? "");
  const isPending = createTenant.isPending || updateTenant.isPending;

  const tenantFormSchema = useMemo(() => createTenantFormSchema(t), [t]);
  const tenantTypeOptions = getTenantTypeOptions(t);

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && tenant) {
      form.reset({
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan ?? "",
        type: tenant.type ?? "",
      });
    } else {
      form.reset(emptyValues);
    }
  }, [open, isEdit, tenant, form]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

  const onSubmit = (values: TenantFormValues) => {
    const data = {
      ...values,
      plan: values.plan || undefined,
      type: values.type || undefined,
    };

    if (isEdit && tenant) {
      updateTenant.mutate(data, { onSuccess: () => onClose(), onError });
    } else {
      createTenant.mutate(data, { onSuccess: () => onClose(), onError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? t("tenants.form.editTitle") : t("tenants.form.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tenants.form.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("tenants.form.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tenants.form.slugLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("tenants.form.slugPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ControlledSelect
              control={form.control}
              name="type"
              label={t("tenants.form.typeLabel")}
              options={tenantTypeOptions}
              placeholder={t("tenants.form.typePlaceholder")}
            />

            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tenants.form.planLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("tenants.form.planPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
