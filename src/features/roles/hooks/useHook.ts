import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roleKeys } from "../constants";
import { createRole, deleteRole, getAllRoles, updateRole } from "../api";
import type { CreateRoleDto, UpdateRoleDto } from "../types";

export const useRoles = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: roleKeys.allRoles(params),
    queryFn: () => getAllRoles(params),
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleDto) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.allRoles() });
    },
  });
};

export const useUpdateRole = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoleDto) => updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.allRoles() });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.allRoles() });
    },
  });
};
