import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { TeacherCalendarResponse } from "../types";

export const getTeacherCalendar = async (params: {
  groupId: string;
  year: number;
  month: number;
}): Promise<TeacherCalendarResponse> => {
  const res = await request.get<TeacherCalendarResponse>(
    `${ENDPOINTS.SCHEDULE_TEMPLATES}/calendar`,
    { params },
  );
  return res.data;
};
