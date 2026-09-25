import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useUsernameSuggestion } from "@/hooks";
import {
  getApiErrorMessage,
  getUserConflictField,
} from "@/ustils/username";
import { ROLES } from "@/assets/constants";
import { useRoles } from "@/features/roles/hooks";
import {
  createCreateStudentSchema,
  createEditStudentSchema,
  type CreateFormValues,
  type EditFormValues,
} from "../schema";
import type { StudentDetail, StudentDetailFull } from "../types";
import { useCreateStudent, useUpdateStudent } from "./useHook";

interface Props {
  open: boolean;
  isEdit: boolean;
  onClose: () => void;
  student?: StudentDetail | StudentDetailFull;
}
export const useCreateEditStudent = ({
  open,
  isEdit,
  onClose,
  student,
}: Props) => {
  const { t } = useTranslation();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent(student?.id ?? "");
  const isPending = createStudent.isPending || updateStudent.isPending;

  const { data: roles } = useRoles();
  const studentRoleId =
    roles?.data.find((r) => r.name === ROLES.STUDENT)?.id ?? "";

  const createStudentSchema = useMemo(
    () => createCreateStudentSchema(t),
    [t],
  );
  const editStudentSchema = useMemo(() => createEditStudentSchema(t), [t]);

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      username: "",
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
      username: "",
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
        username: student.username ?? "",
        fullName: student.fullName,
        phone: student.phone,
        email: student.email ?? "",
        avatarUrl: student.avatarUrl ?? "",
        parentPhone: student.parentPhone ?? "",
      });
    } else {
      createForm.reset({
        username: "",
        fullName: "",
        phone: "",
        password: "",
        roleId: studentRoleId,
      });
    }
  }, [open, isEdit, student, studentRoleId, createForm, editForm]);

  useUsernameSuggestion(createForm, open && !isEdit);

  // 409 (username/telefon band) — xatoni input ostida ko'rsatamiz
  const handleError =
    (setError: (field: "username" | "phone", message: string) => void) =>
    (error: unknown) => {
      const field = getUserConflictField(error);
      if (field) {
        setError(
          field,
          field === "username"
            ? t("username.taken")
            : (getApiErrorMessage(error) ?? ""),
        );
        return;
      }
      toast.error(getApiErrorMessage(error) || t("common.error"));
    };

  const onSubmitCreate = (values: CreateFormValues) => {
    const payload: CreateFormValues = {
      username: values.username,
      fullName: values.fullName,
      phone: values.phone,
      password: values.password,
      roleId: values.roleId,
    };

    if (values.email) payload.email = values.email;
    if (values.parentPhone) payload.parentPhone = values.parentPhone;
    if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
    createStudent.mutate(payload, {
      onSuccess: onClose,
      onError: handleError((field, message) =>
        createForm.setError(field, { message }),
      ),
    });
  };

  const onSubmitEdit = (values: EditFormValues) => {
    const payload: Record<string, string> = {
      username: values.username,
      fullName: values.fullName,
      phone: values.phone,
    };
    if (values.email) payload.email = values.email;
    if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
    if (values.parentPhone) payload.parentPhone = values.parentPhone;
    updateStudent.mutate(payload, {
      onSuccess: onClose,
      onError: handleError((field, message) =>
        editForm.setError(field, { message }),
      ),
    });
  };

  return {
    isPending,
    onSubmitCreate,
    onSubmitEdit,
    createForm,
    editForm,
  };
};
