import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { MyGroupItem } from "../types";

export const getMyGroups = async (): Promise<MyGroupItem[]> => {
  const res = await request.get<MyGroupItem[]>(`${ENDPOINTS.GROUPS}/me`);
  return res.data;
};
