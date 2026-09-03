import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { TeacherDashboardResponse } from "../types";

export const getMyTeacherDashboard = async (): Promise<TeacherDashboardResponse> => {
  const res = await request.get<TeacherDashboardResponse>(
    `${ENDPOINTS.TEACHER_SELF}/me/dashboard`,
  );
  return res.data;
};
