import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useRoles } from "@/features/roles/hooks";
import { ROLES } from "@/assets/constants";
import {
  createCreateTeacherSchema,
  createEditTeacherSchema,
  type CreateTeacherFormValues,
  type EditTeacherFormValues,
} from "../schema";
import type { TeacherEditable } from "../types";
import { useCreateTeacher, useUpdateTeacher } from "./useHook";

interface Props {
  open: boolean;
  isEdit: boolean;
  onClose: () => void;
  teacher?: TeacherEditable;
}

const emptyCreateValues: CreateTeacherFormValues = {
  fullName: "",
  phone: "",
  password: "",
  email: "",
  avatarUrl: "",
};

export const useCreateEditTeacher = ({
  open,
  isEdit,
  onClose,
  teacher,
}: Props) => {
  const { t } = useTranslation();
  const { data: roles } = useRoles();
  const teacherRoleId = roles?.data.find((r) => r.name === ROLES.TEACHER)?.id;

  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher(teacher?.id ?? "");
  const isPending = createTeacher.isPending || updateTeacher.isPending;

  const createTeacherSchema = useMemo(
    () => createCreateTeacherSchema(t),
    [t],
  );
  const editTeacherSchema = useMemo(() => createEditTeacherSchema(t), [t]);

  const createForm = useForm<CreateTeacherFormValues>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: emptyCreateValues,
  });

  const editForm = useForm<EditTeacherFormValues>({
    resolver: zodResolver(editTeacherSchema),
    defaultValues: { fullName: "", phone: "", email: "", avatarUrl: "" },
  });

  useEffect(() => {
    if (!open) {
      createForm.reset();
      editForm.reset();
      return;
    }
    if (isEdit && teacher) {
      editForm.reset({
        fullName: teacher.fullName,
        phone: teacher.phone,
        email: teacher.email ?? "",
        avatarUrl: teacher.avatarUrl ?? "",
      });
    } else {
      createForm.reset(emptyCreateValues);
    }
  }, [open, isEdit, teacher, createForm, editForm]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

  const onSubmitCreate = (values: CreateTeacherFormValues) => {
    if (!teacherRoleId) {
      toast.error(t("teachers.roleNotFound"));
      return;
    }

    const payload = {
      fullName: values.fullName,
      phone: values.phone,
      password: values.password,
      roleId: teacherRoleId,
      ...(values.email ? { email: values.email } : {}),
      ...(values.avatarUrl ? { avatarUrl: values.avatarUrl } : {}),
    };
    createTeacher.mutate(payload, { onSuccess: onClose, onError });
  };

  const onSubmitEdit = (values: EditTeacherFormValues) => {
    const payload: Record<string, string> = {
      fullName: values.fullName,
      phone: values.phone,
    };
    if (values.email) payload.email = values.email;
    if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
    updateTeacher.mutate(payload, { onSuccess: onClose, onError });
  };

  return {
    isPending,
    onSubmitCreate,
    onSubmitEdit,
    createForm,
    editForm,
  };
};
