import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { GroupResponse } from "../types";

export const getAllGroups = async (
  params?: Record<string, string | undefined>,
): Promise<GroupResponse> => {
  const res = await request.get<GroupResponse>(ENDPOINTS.GROUPS, {
    params,
  });
  return res.data;
};
