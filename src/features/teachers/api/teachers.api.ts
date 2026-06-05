import { request } from "@/services/api";
import type { TeacherResponse } from "../types";
import { ENDPOINTS } from "@/services/endpoints";

export const getAllTeachers = async (
  params?: Record<string, string | undefined>,
): Promise<TeacherResponse> => {
  const res = await request.get<TeacherResponse>(ENDPOINTS.TEACHERS, {
    params,
  });
  return res.data;
};
