import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { AuditLogsParams, AuditLogsResponse } from "../types";

export const getAuditLogs = async (
  params?: AuditLogsParams,
): Promise<AuditLogsResponse> => {
  const res = await request.get<AuditLogsResponse>(ENDPOINTS.AUDIT_LOGS, {
    params,
  });
  return res.data;
};
