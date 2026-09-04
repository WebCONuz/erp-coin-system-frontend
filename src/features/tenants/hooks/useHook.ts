import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tenantQueryKeys } from "../constants";
import {
  createTenant,
  getAllTenants,
  getTenantById,
  toggleTenantActive,
  updateTenant,
} from "../api/tenants.api";
import type { CreateTenantDto, UpdateTenantDto } from "../types";

export const useAllTenants = (
  isSent: boolean = false,
  params?: Record<string, string | undefined>,
) => {
  return useQuery({
    queryKey: tenantQueryKeys.allTenants(params),
    queryFn: () => getAllTenants(params),
    enabled: isSent,
  });
};

export const useTenant = (id?: string) => {
  return useQuery({
    queryKey: tenantQueryKeys.oneTenantById(id ?? ""),
    queryFn: () => getTenantById(id as string),
    enabled: !!id,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantDto) => createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.allTenants(),
      });
    },
  });
};

export const useUpdateTenant = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTenantDto) => updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.allTenants(),
      });
    },
  });
};

export const useToggleTenantActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleTenantActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.allTenants(),
      });
    },
  });
};
