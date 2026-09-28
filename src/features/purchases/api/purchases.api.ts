import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  PurchasesResponse,
  UpdatePurchaseStatusDto,
  UpdatePurchaseStatusResponse,
} from "../types";

// Student uchun backend faqat o'z xaridlarini qaytaradi (`studentId` e'tiborsiz).
export const getAllPurchases = async (
  params?: Record<string, string | undefined>,
): Promise<PurchasesResponse> => {
  const res = await request.get<PurchasesResponse>(ENDPOINTS.PURCHASES, {
    params,
  });
  return res.data;
};

export const updatePurchaseStatus = async (
  id: string,
  data: UpdatePurchaseStatusDto,
): Promise<UpdatePurchaseStatusResponse> => {
  const res = await request.patch<UpdatePurchaseStatusResponse>(
    `${ENDPOINTS.PURCHASES}/${id}/status`,
    data,
  );
  return res.data;
};
