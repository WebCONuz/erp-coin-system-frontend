import { request } from "@/services/api";
import type { StudentsResponse } from "../types";
import { ENDPOINTS } from "@/services/endpoints";

export const getAllStudents = async (
  params?: Record<string, string | undefined>,
): Promise<StudentsResponse> => {
  const res = await request.get<StudentsResponse>(ENDPOINTS.STUDENTS, {
    params,
  });
  return res.data;
};
