import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CreateHolidayDto,
  CreateHolidayResponse,
  DeleteHolidayResponse,
  HolidaysResponse,
} from "../types";

export const getHolidays = async (params: {
  from: string;
  to: string;
}): Promise<HolidaysResponse> => {
  const res = await request.get<HolidaysResponse>(ENDPOINTS.HOLIDAYS, {
    params,
  });
  return res.data;
};

export const createHoliday = async (
  data: CreateHolidayDto,
): Promise<CreateHolidayResponse> => {
  const res = await request.post<CreateHolidayResponse>(
    ENDPOINTS.HOLIDAYS,
    data,
  );
  return res.data;
};

export const deleteHoliday = async (
  id: string,
): Promise<DeleteHolidayResponse> => {
  const res = await request.delete<DeleteHolidayResponse>(
    `${ENDPOINTS.HOLIDAYS}/${id}`,
  );
  return res.data;
};
