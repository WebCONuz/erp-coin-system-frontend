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
import {
  createCreateEmployeeSchema,
  createEditEmployeeSchema,
  type CreateEmployeeFormValues,
  type EditEmployeeFormValues,
} from "../schema";
import type { Employee } from "../types";
import { useCreateEmployee, useUpdateEmployee } from "./useHook";

interface Props {
  open: boolean;
  isEdit: boolean;
  onClose: () => void;
  employee?: Employee;
}

export const useCreateEditEmployee = ({
  open,
  isEdit,
  onClose,
  employee,
}: Props) => {
  const { t } = useTranslation();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee(employee?.id ?? "");
  const isPending = createEmployee.isPending || updateEmployee.isPending;

  const createEmployeeSchema = useMemo(
    () => createCreateEmployeeSchema(t),
    [t],
  );
  const editEmployeeSchema = useMemo(() => createEditEmployeeSchema(t), [t]);

  const createForm = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
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

  const editForm = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      username: "",
      fullName: "",
      phone: "",
      roleId: "",
      email: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (!open) {
      createForm.reset();
      editForm.reset();
      return;
    }
    if (isEdit && employee) {
      editForm.reset({
        username: employee.username ?? "",
        fullName: employee.fullName,
        phone: employee.phone,
        roleId: employee.role.id,
        email: employee.email ?? "",
        avatarUrl: employee.avatarUrl ?? "",
      });
    } else {
      createForm.reset({
        username: "",
        fullName: "",
        phone: "",
        password: "",
        roleId: "",
        email: "",
        parentPhone: "",
        avatarUrl: "",
      });
    }
  }, [open, isEdit, employee, createForm, editForm]);

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

  const onSubmitCreate = (values: CreateEmployeeFormValues) => {
    const payload: CreateEmployeeFormValues = {
      username: values.username,
      fullName: values.fullName,
      phone: values.phone,
      password: values.password,
      roleId: values.roleId,
    };
    if (values.email) payload.email = values.email;
    if (values.parentPhone) payload.parentPhone = values.parentPhone;
    if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
    createEmployee.mutate(payload, {
      onSuccess: onClose,
      onError: handleError((field, message) =>
        createForm.setError(field, { message }),
      ),
    });
  };

  const onSubmitEdit = (values: EditEmployeeFormValues) => {
    const payload: Record<string, string> = {
      username: values.username,
      fullName: values.fullName,
      phone: values.phone,
      roleId: values.roleId,
    };
    if (values.email) payload.email = values.email;
    if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
    updateEmployee.mutate(payload, {
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
