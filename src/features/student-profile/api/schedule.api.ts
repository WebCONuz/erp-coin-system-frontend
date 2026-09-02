import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { MyCalendarResponse } from "../types";

export const getMyCalendar = async (params: {
  year: number;
  month: number;
}): Promise<MyCalendarResponse> => {
  const res = await request.get<MyCalendarResponse>(
    `${ENDPOINTS.SCHEDULE_TEMPLATES}/calendar/me`,
    { params },
  );
  return res.data;
};
