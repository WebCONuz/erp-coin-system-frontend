import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { TeacherProfile, UpdateMyProfileDto } from "../types";

export const getMyTeacherProfile = async (): Promise<TeacherProfile> => {
  const res = await request.get<TeacherProfile>(`${ENDPOINTS.USERS}/me`);
  return res.data;
};

export const updateMyTeacherProfile = async (
  data: UpdateMyProfileDto,
): Promise<TeacherProfile> => {
  const res = await request.patch<TeacherProfile>(
    `${ENDPOINTS.USERS}/me`,
    data,
  );
  return res.data;
};
