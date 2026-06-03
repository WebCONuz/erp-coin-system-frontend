import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { LoginDto, ResponseUserMe, UserMe } from "../types";

export const login = async (data: LoginDto) => {
  const res = await request.post(ENDPOINTS.LOGIN, data);
  return res.data;
};

export const getMe = async (): Promise<UserMe> => {
  const res = await request.get<ResponseUserMe>(ENDPOINTS.ME);
  return res.data.data;
};

export const logout = async (): Promise<{ success: boolean }> => {
  const res = await request.post<{ success: boolean }>(ENDPOINTS.LOGOUT);
  return res.data;
};
