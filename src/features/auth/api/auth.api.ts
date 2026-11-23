import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { LoginDto, ResponseLogin, ResponseUserMe, UserMe } from "../types";

export const login = async (data: LoginDto): Promise<ResponseLogin> => {
  const res = await request.post<ResponseLogin>(ENDPOINTS.LOGIN, data);
  return res.data;
};

export const getMe = async (): Promise<UserMe> => {
  const res = await request.get<ResponseUserMe>(ENDPOINTS.ME);
  return res.data.data;
};

// Faqat joriy qurilma yopiladi. Access token talab qilinmaydi — doim `200`.
export const logout = async (): Promise<{ message: string }> => {
  const res = await request.post<{ message: string }>(ENDPOINTS.LOGOUT);
  return res.data;
};

// Barcha qurilmalardagi sessiyalar yopiladi (boshqa qurilmalarda access token
// ko'pi bilan 15 daqiqa amal qiladi, keyin refresh `401`).
export const logoutAll = async (): Promise<{ message: string }> => {
  const res = await request.post<{ message: string }>(ENDPOINTS.LOGOUT_ALL);
  return res.data;
};
