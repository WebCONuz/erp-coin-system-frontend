import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import { TENANT_KEY } from "@/features/tenants/constants";
import type {
  CalendarResponse,
  CreateExceptionDto,
  CreateScheduleTemplateDto,
  GenerateSessionsDto,
  GenerateSessionsResponse,
  ScheduleException,
  ScheduleTemplate,
  ScheduleTemplatesResponse,
  UpdateExceptionDto,
  UpdateScheduleTemplateDto,
} from "../types";

// ─── Schedule templates ───────────────────────────────────────────────────────
export const getScheduleTemplates = async (
  params?: Record<string, string | undefined>,
): Promise<ScheduleTemplatesResponse> => {
  const res = await request.get<ScheduleTemplatesResponse>(
    ENDPOINTS.SCHEDULE_TEMPLATES,
    { params },
  );
  return res.data;
};

export const createScheduleTemplate = async (
  data: CreateScheduleTemplateDto,
): Promise<ScheduleTemplate> => {
  const res = await request.post<ScheduleTemplate>(
    ENDPOINTS.SCHEDULE_TEMPLATES,
    { ...data, tenantId: localStorage.getItem(TENANT_KEY) ?? undefined },
  );
  return res.data;
};

export const updateScheduleTemplate = async (
  templateId: string,
  data: UpdateScheduleTemplateDto,
): Promise<ScheduleTemplate> => {
  const res = await request.patch<ScheduleTemplate>(
    `${ENDPOINTS.SCHEDULE_TEMPLATES}/${templateId}`,
    data,
  );
  return res.data;
};

export const deleteScheduleTemplate = async (
  templateId: string,
): Promise<void> => {
  await request.delete(`${ENDPOINTS.SCHEDULE_TEMPLATES}/${templateId}`);
};

// ─── Calendar ─────────────────────────────────────────────────────────────────
export const getScheduleCalendar = async (params: {
  groupId: string;
  year: number;
  month: number;
}): Promise<CalendarResponse> => {
  const res = await request.get<CalendarResponse>(
    `${ENDPOINTS.SCHEDULE_TEMPLATES}/calendar`,
    { params },
  );
  return res.data;
};

export const generateSessions = async (
  data: GenerateSessionsDto,
): Promise<GenerateSessionsResponse> => {
  const res = await request.post<GenerateSessionsResponse>(
    `${ENDPOINTS.SCHEDULE_TEMPLATES}/generate-sessions`,
    data,
  );
  return res.data;
};

// ─── Exceptions ───────────────────────────────────────────────────────────────
export const createException = async (
  templateId: string,
  data: CreateExceptionDto,
): Promise<ScheduleException> => {
  const res = await request.post<ScheduleException>(
    `${ENDPOINTS.SCHEDULE_TEMPLATES}/${templateId}/exceptions`,
    data,
  );
  return res.data;
};

export const updateException = async (
  exceptionId: string,
  data: UpdateExceptionDto,
): Promise<ScheduleException> => {
  const res = await request.patch<ScheduleException>(
    `${ENDPOINTS.SCHEDULE_EXCEPTIONS}/${exceptionId}`,
    data,
  );
  return res.data;
};

export const deleteException = async (exceptionId: string): Promise<void> => {
  await request.delete(`${ENDPOINTS.SCHEDULE_EXCEPTIONS}/${exceptionId}`);
};
