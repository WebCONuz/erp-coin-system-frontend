import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { MyAttendanceParams, MyAttendanceResponse } from "../types";

export const getMyAttendance = async (
  params?: MyAttendanceParams,
): Promise<MyAttendanceResponse> => {
  const res = await request.get<MyAttendanceResponse>(
    `${ENDPOINTS.SESSIONS}/me/attendance`,
    { params },
  );
  return res.data;
};
