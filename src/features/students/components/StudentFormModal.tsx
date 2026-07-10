import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useCreateStudent, useUpdateStudent } from "../hooks";
import type { StudentDetail, StudentDetailFull } from "../types";

const createStudentSchema = z.object({
  fullName: z
    .string()
    .min(2, "F.I.Sh kamida 2 ta belgi bo'lishi kerak")
    .max(100, "F.I.Sh 100 ta belgidan oshmasligi kerak"),
  phone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak")
    .max(13, "Telefon raqam juda uzun"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  roleId: z.string().min(1, "Rol ID majburiy"),
  email: z.string().email("Email noto'g'ri formatda").optional().or(z.literal("")),
  parentPhone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam")
    .max(13, "Telefon raqam juda uzun")
    .optional()
    .or(z.literal("")),
  avatarUrl: z.string().url("URL noto'g'ri formatda").optional().or(z.literal("")),
});

const editStudentSchema = z.object({
  fullName: z
    .string()
    .min(2, "F.I.Sh kamida 2 ta belgi bo'lishi kerak")
    .max(100, "F.I.Sh 100 ta belgidan oshmasligi kerak"),
  phone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak")
    .max(13, "Telefon raqam juda uzun"),
  email: z
    .string()
    .email("Email noto'g'ri formatda")
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url("URL noto'g'ri formatda")
    .optional()
    .or(z.literal("")),
  parentPhone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam")
    .max(13, "Telefon raqam juda uzun")
    .optional()
    .or(z.literal("")),
});

type CreateFormValues = z.infer<typeof createStudentSchema>;

type EditFormValues = z.infer<typeof editStudentSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  student?: StudentDetail | StudentDetailFull;
  defaultRoleId?: string;
}

export const StudentFormModal = ({
  open,
  onClose,
  mode,
  student,
  defaultRoleId = "",
}: Props) => {
  const isEdit = mode === "edit";

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent(student?.id ?? "");
  const isPending = createStudent.isPending || updateStudent.isPending;

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: { fullName: "", phone: "", password: "", roleId: "", email: "", parentPhone: "", avatarUrl: "" },
  });

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: { fullName: "", phone: "", email: "", avatarUrl: "", parentPhone: "" },
  });

  useEffect(() => {
    if (!open) {
      createForm.reset();
      editForm.reset();
      return;
    }
    if (isEdit && student) {
      editForm.reset({
        fullName: student.fullName,
        phone: student.phone,
        email: student.email ?? "",
        avatarUrl: student.avatarUrl ?? "",
        parentPhone: student.parentPhone ?? "",
      });
    } else {
      createForm.reset({ fullName: "", phone: "", password: "", roleId: defaultRoleId });
    }
  }, [open, isEdit, student, defaultRoleId, createForm, editForm]);

  const onSubmitCreate = (values: CreateFormValues) => {
    const payload: CreateFormValues = {
      fullName: values.fullName,
      phone: values.phone,
      password: values.password,
      roleId: values.roleId,
    };
    if (values.email) payload.email = values.email;
    if (values.parentPhone) payload.parentPhone = values.parentPhone;
    if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
    createStudent.mutate(payload, { onSuccess: onClose });
  };

  const onSubmitEdit = (values: EditFormValues) => {
    const payload: Record<string, string> = {
      fullName: values.fullName,
      phone: values.phone,
    };
    if (values.email) payload.email = values.email;
    if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
    if (values.parentPhone) payload.parentPhone = values.parentPhone;
    updateStudent.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? "Talabani tahrirlash" : "Yangi talaba qo'shish"}
          </DialogTitle>
        </DialogHeader>

        {isEdit ? (
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={editForm.control}
                  name="fullName"
                  label="F.I.Sh"
                  placeholder="Sardor Rahimov"
                />
                <ControlledInput
                  control={editForm.control}
                  name="phone"
                  label="Telefon raqam"
                  placeholder="+998901234567"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={editForm.control}
                  name="email"
                  label="Email (ixtiyoriy)"
                  placeholder="sardor@example.com"
                  type="email"
                />
                <ControlledInput
                  control={editForm.control}
                  name="parentPhone"
                  label="Ota-ona telefoni (ixtiyoriy)"
                  placeholder="+998901234567"
                />
              </div>

              <ControlledInput
                control={editForm.control}
                name="avatarUrl"
                label="Avatar URL (ixtiyoriy)"
                placeholder="https://example.com/avatar.jpg"
              />

              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPending ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4">
              <ControlledInput
                control={createForm.control}
                name="fullName"
                label="F.I.Sh"
                placeholder="Sardor Rahimov"
              />
              <ControlledInput
                control={createForm.control}
                name="phone"
                label="Telefon raqam"
                placeholder="+998901234567"
              />
              <ControlledInput
                control={createForm.control}
                name="password"
                label="Parol"
                placeholder="Parol kiriting"
                type="password"
              />
              <ControlledInput
                control={createForm.control}
                name="roleId"
                label="Rol ID"
                placeholder="UUID formatida rol identifikatori"
              />

              <div className="grid grid-cols-2 gap-3">
                <ControlledInput
                  control={createForm.control}
                  name="email"
                  label="Email (ixtiyoriy)"
                  placeholder="ali@gmail.com"
                  type="email"
                />
                <ControlledInput
                  control={createForm.control}
                  name="parentPhone"
                  label="Ota-ona telefoni (ixtiyoriy)"
                  placeholder="+998901234568"
                />
              </div>

              <ControlledInput
                control={createForm.control}
                name="avatarUrl"
                label="Avatar URL (ixtiyoriy)"
                placeholder="https://example.com/avatar.jpg"
              />

              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isPending ? "Qo'shilmoqda..." : "Qo'shish"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
