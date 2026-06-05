import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { CourseResponse } from "../types";

export const getAllCourses = async (
  params?: Record<string, string | undefined>,
): Promise<CourseResponse> => {
  const res = await request.get<CourseResponse>(ENDPOINTS.COURSES, {
    params,
  });
  return res.data;
};
