import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { TeacherGroupItem } from "../types";

export const getMyTaughtGroups = async (): Promise<TeacherGroupItem[]> => {
  const res = await request.get<TeacherGroupItem[]>(`${ENDPOINTS.GROUPS}/me`);
  return res.data;
};
