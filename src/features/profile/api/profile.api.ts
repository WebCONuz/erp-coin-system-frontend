import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  ChangeMyPasswordDto,
  MyProfile,
  UpdateMyProfileDto,
} from "../types";

export const getMyProfile = async (): Promise<MyProfile> => {
  const res = await request.get<MyProfile>(`${ENDPOINTS.USERS}/me`);
  return res.data;
};

export const updateMyProfile = async (
  data: UpdateMyProfileDto,
): Promise<MyProfile> => {
  const res = await request.patch<MyProfile>(`${ENDPOINTS.USERS}/me`, data);
  return res.data;
};

export const changeMyPassword = async (
  id: string,
  data: ChangeMyPasswordDto,
): Promise<{ message: string }> => {
  const res = await request.patch<{ message: string }>(
    `${ENDPOINTS.USERS}/${id}/change-password`,
    data,
  );
  return res.data;
};
