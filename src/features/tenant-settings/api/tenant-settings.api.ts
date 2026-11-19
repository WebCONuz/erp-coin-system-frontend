import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  TenantSettings,
  TenantSettingsResponse,
  UpdateTenantSettingsDto,
  UpdateTenantSettingsResponse,
} from "../types";

export const getTenantSettings = async (): Promise<TenantSettings> => {
  const res = await request.get<TenantSettingsResponse>(
    ENDPOINTS.TENANT_SETTINGS,
  );
  return res.data.data;
};

export const updateTenantSettings = async (
  data: UpdateTenantSettingsDto,
): Promise<UpdateTenantSettingsResponse> => {
  const res = await request.patch<UpdateTenantSettingsResponse>(
    ENDPOINTS.TENANT_SETTINGS,
    data,
  );
  return res.data;
};
