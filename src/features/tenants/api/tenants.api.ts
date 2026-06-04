import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { TenantResponse, TenentType } from "../types";

export const getAllTenants = async (
  params?: Record<string, string | undefined>,
): Promise<TenentType[]> => {
  const res = await request.get<TenantResponse>(ENDPOINTS.TENANTS, {
    params,
  });
  return res.data.data;
};
