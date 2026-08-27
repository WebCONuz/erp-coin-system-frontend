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
import { useUpdateStudent } from "@/features/students/hooks";
import type { StudentDetailFull } from "@/features/students/types";
import { editProfileSchema, type EditProfileFormValues } from "../schema";

interface Props {
  open: boolean;
  onClose: () => void;
  student: StudentDetailFull;
}

export const EditProfileModal = ({ open, onClose, student }: Props) => {
  const updateStudent = useUpdateStudent(student.id);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: student.fullName,
      phone: student.phone,
      email: student.email ?? "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      fullName: student.fullName,
      phone: student.phone,
      email: student.email ?? "",
    });
  }, [open, student, form]);

  const onSubmit = (values: EditProfileFormValues) => {
    const payload: Record<string, string> = {
      fullName: values.fullName,
      phone: values.phone,
    };
    if (values.email) payload.email = values.email;

    updateStudent.mutate(payload, {
      onSuccess: () => {
        toast.success("Ma'lumotlar yangilandi");
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
          <DialogTitle>Ma'lumotlarni tahrirlash</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ControlledInput
              control={form.control}
              name="fullName"
              label="F.I.Sh"
              placeholder="Sardor Toshmatov"
            />
            <ControlledInput
              control={form.control}
              name="phone"
              label="Telefon raqam"
              placeholder="+998901234567"
            />
            <ControlledInput
              control={form.control}
              name="email"
              label="Email (ixtiyoriy)"
              placeholder="sardor@example.com"
              type="email"
            />

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateStudent.isPending}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={updateStudent.isPending}>
                {updateStudent.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
