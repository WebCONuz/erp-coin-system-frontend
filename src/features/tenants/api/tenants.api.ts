import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CreateTenantDto,
  TenantResponse,
  TenentType,
  UpdateTenantDto,
} from "../types";

export const getAllTenants = async (
  params?: Record<string, string | undefined>,
): Promise<TenentType[]> => {
  const res = await request.get<TenantResponse>(ENDPOINTS.TENANTS, {
    params,
  });
  return res.data.data;
};

export const getTenantById = async (id: string): Promise<TenentType> => {
  const res = await request.get<{ status: string; data: TenentType }>(
    `${ENDPOINTS.TENANTS}/${id}`,
  );
  return res.data.data;
};

export const createTenant = async (
  data: CreateTenantDto,
): Promise<TenentType> => {
  const res = await request.post<TenentType>(ENDPOINTS.TENANTS, data);
  return res.data;
};

export const updateTenant = async (
  id: string,
  data: UpdateTenantDto,
): Promise<TenentType> => {
  const res = await request.patch<TenentType>(
    `${ENDPOINTS.TENANTS}/${id}`,
    data,
  );
  return res.data;
};

export const toggleTenantActive = async (id: string): Promise<TenentType> => {
  const res = await request.patch<TenentType>(
    `${ENDPOINTS.TENANTS}/${id}/toggle-active`,
  );
  return res.data;
};
