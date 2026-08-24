import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { employeeKeys } from "../constants";
import {
  archiveEmployee,
  changeEmployeePassword,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  restoreEmployee,
  updateEmployee,
} from "../api";
import type {
  ChangeEmployeePasswordDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types";

export const useEmployees = () => {
  const [searchParams] = useSearchParams();
  const params = {
    search: searchParams.get("search") || undefined,
    isActive:
      searchParams.get("status") === "archive"
        ? "false"
        : searchParams.get("status") === "active"
          ? "true"
          : undefined,
    page: searchParams.get("page") || undefined,
  };

  return useQuery({
    queryKey: employeeKeys.allEmployees(params),
    queryFn: () => getAllEmployees(params),
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.oneEmployeeById(id),
    queryFn: () => getEmployeeById(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.allEmployees(),
      });
    },
  });
};

export const useUpdateEmployee = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmployeeDto) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.allEmployees(),
      });
      queryClient.invalidateQueries({
        queryKey: employeeKeys.oneEmployeeById(id),
      });
    },
  });
};

export const useChangeEmployeePassword = (id: string) => {
  return useMutation({
    mutationFn: (data: ChangeEmployeePasswordDto) =>
      changeEmployeePassword(id, data),
  });
};

export const useArchiveEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.allEmployees(),
      });
    },
  });
};

export const useRestoreEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.allEmployees(),
      });
    },
  });
};
