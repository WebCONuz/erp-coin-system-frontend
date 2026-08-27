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
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/controls";
import { useChangeStudentPassword } from "@/features/students/hooks";
import { changePasswordSchema, type ChangePasswordFormValues } from "../schema";

interface Props {
  open: boolean;
  onClose: () => void;
  studentId: string;
}

export const ChangePasswordModal = ({ open, onClose, studentId }: Props) => {
  const changePassword = useChangeStudentPassword(studentId);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ oldPassword: "", newPassword: "" });
    }
  }, [open, form]);

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        toast.success("Parol muvaffaqiyatli o'zgartirildi");
        onClose();
      },
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>Parolni o'zgartirish</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ControlledInput
              control={form.control}
              name="oldPassword"
              label="Joriy parol"
              placeholder="Joriy parolingiz"
              type="password"
            />
            <ControlledInput
              control={form.control}
              name="newPassword"
              label="Yangi parol"
              placeholder="Yangi parol kiriting"
              type="password"
            />

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={changePassword.isPending}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
