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
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { ROLES } from "@/assets/constants";
import { roleFormSchema, type RoleFormValues } from "../schema";
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
  const isEdit = mode === "edit";
  const { user } = useAuth();
  const canSetCanDelete =
    user?.role.name === ROLES.SUPER_ADMIN || user?.role.name === ROLES.CREATOR;

  const createRole = useCreateRole();
  const updateRole = useUpdateRole(role?.id ?? "");
  const isPending = createRole.isPending || updateRole.isPending;

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
    toast.error(error?.data?.message || "Xatolik yuz berdi");

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
            {isEdit ? "Rolni tahrirlash" : "Yangi rol yaratish"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol nomi (kod)</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: teacher" {...field} />
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
                  <FormLabel>Ko'rsatiladigan nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: O'qituvchi" {...field} />
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
                    <FormLabel>Daraja</FormLabel>
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
                    <FormLabel>Scope</FormLabel>
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
                      Bu rolni keyinchalik o'chirish mumkin bo'lsin
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
