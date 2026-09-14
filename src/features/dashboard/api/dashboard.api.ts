import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { AdminDashboardResponse } from "../types";

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const res = await request.get<AdminDashboardResponse>(
    `${ENDPOINTS.DASHBOARD}/admin`,
  );
  return res.data;
};
