import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { RolesResponse } from "../types";

// Rollar faqat backend tomonidan boshqariladi — frontend ularni faqat o'qiydi.
export const getAllRoles = async (
  params?: Record<string, string | undefined>,
): Promise<RolesResponse> => {
  const res = await request.get<RolesResponse>(ENDPOINTS.ROLES, { params });
  return res.data;
};
