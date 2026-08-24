import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createEmployeeSchema,
  editEmployeeSchema,
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
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee(employee?.id ?? "");
  const isPending = createEmployee.isPending || updateEmployee.isPending;

  const createForm = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
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

  const editForm = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
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
        fullName: employee.fullName,
        phone: employee.phone,
        roleId: employee.role.id,
        email: employee.email ?? "",
        avatarUrl: employee.avatarUrl ?? "",
      });
    } else {
      createForm.reset({
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

  const onError = (error: any) =>
    toast.error(error?.data?.message || "Xatolik yuz berdi");

  const onSubmitCreate = (values: CreateEmployeeFormValues) => {
    const payload: CreateEmployeeFormValues = {
      fullName: values.fullName,
      phone: values.phone,
      password: values.password,
      roleId: values.roleId,
    };
    if (values.email) payload.email = values.email;
    if (values.parentPhone) payload.parentPhone = values.parentPhone;
    if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
    createEmployee.mutate(payload, { onSuccess: onClose, onError });
  };

  const onSubmitEdit = (values: EditEmployeeFormValues) => {
    const payload: Record<string, string> = {
      fullName: values.fullName,
      phone: values.phone,
      roleId: values.roleId,
    };
    if (values.email) payload.email = values.email;
    if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
    updateEmployee.mutate(payload, { onSuccess: onClose, onError });
  };

  return {
    isPending,
    onSubmitCreate,
    onSubmitEdit,
    createForm,
    editForm,
  };
};
