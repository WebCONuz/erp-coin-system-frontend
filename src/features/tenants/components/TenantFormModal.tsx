import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { tenantFormSchema, type TenantFormValues } from "../schema";
import { useCreateTenant, useUpdateTenant } from "../hooks";
import { TENANT_TYPE_OPTIONS } from "../constants";
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
  const isEdit = mode === "edit";
  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant(tenant?.id ?? "");
  const isPending = createTenant.isPending || updateTenant.isPending;

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
    toast.error(error?.data?.message || "Xatolik yuz berdi");

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
            {isEdit ? "Markazni tahrirlash" : "Yangi markaz qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Markaz nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: Gullola EDU" {...field} />
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
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: gullola-edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ControlledSelect
              control={form.control}
              name="type"
              label="Tashkilot turi (Ixtiyoriy)"
              options={TENANT_TYPE_OPTIONS}
              placeholder="Turini tanlang"
            />

            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarif (Ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: pro" {...field} />
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
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? "Saqlanmoqda..."
                    : "Yaratilmoqda..."
                  : isEdit
                    ? "Saqlash"
                    : "Yaratish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
