import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { RoomsResponse } from "../types";

export const getAllRooms = async (
  params?: Record<string, string | undefined>,
): Promise<RoomsResponse> => {
  const res = await request.get<RoomsResponse>(ENDPOINTS.ROOMS, { params });
  return res.data;
};
