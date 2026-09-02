import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { DashboardResponse } from "../types";

export const getMyDashboard = async (): Promise<DashboardResponse> => {
  const res = await request.get<DashboardResponse>(
    `${ENDPOINTS.STUDENTS}/me/dashboard`,
  );
  return res.data;
};
