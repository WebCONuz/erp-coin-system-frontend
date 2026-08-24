import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createStudentSchema,
  editStudentSchema,
  type CreateFormValues,
  type EditFormValues,
} from "../schema";
import type { StudentDetail, StudentDetailFull } from "../types";
import { useCreateStudent, useUpdateStudent } from "./useHook";

interface Props {
  open: boolean;
  isEdit: boolean;
  defaultRoleId?: string;
  onClose: () => void;
  student?: StudentDetail | StudentDetailFull;
}
export const useCreateEditStudent = ({
  open,
  isEdit,
  defaultRoleId,
  onClose,
  student,
}: Props) => {
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent(student?.id ?? "");
  const isPending = createStudent.isPending || updateStudent.isPending;

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      password: "",
      roleId: "",
      email: "",
      parentPhone: "",
      avatarUrl: "",
    },
  });

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      avatarUrl: "",
      parentPhone: "",
    },
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
      createForm.reset({
        fullName: "",
        phone: "",
        password: "",
        roleId: defaultRoleId,
      });
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

  return {
    isPending,
    onSubmitCreate,
    onSubmitEdit,
    createForm,
    editForm,
  };
};
