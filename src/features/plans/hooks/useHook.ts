import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { sessionKeys } from "@/features/sessions/constants";
import { scheduleTemplateKeys } from "../constants";
import {
  createException,
  createScheduleTemplate,
  deleteException,
  deleteScheduleTemplate,
  generateSessions,
  getScheduleCalendar,
  getScheduleTemplates,
  updateException,
  updateScheduleTemplate,
} from "../api";
import type {
  CreateExceptionDto,
  CreateScheduleTemplateDto,
  GenerateSessionsDto,
  UpdateExceptionDto,
  UpdateScheduleTemplateDto,
  Weekday,
} from "../types";

/**
 * Shablon/istisno o'zgarsa backend kelajakdagi sessiyalarni ham moslashtiradi
 * (`sessionSync`) — kalendar va sessiyalar ro'yxati keshini yangilaymiz.
 */
export const invalidateScheduleCaches = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: scheduleTemplateKeys.allTemplates(),
  });
  queryClient.invalidateQueries({ queryKey: ["schedule-calendar"] });
  queryClient.invalidateQueries({ queryKey: sessionKeys.allSessions() });
};

// ─── Schedule templates (Kanban) ─────────────────────────────────────────────
export const useScheduleTemplates = (
  params?: Record<string, string | undefined>,
) => {
  return useQuery({
    queryKey: scheduleTemplateKeys.allTemplates(params),
    queryFn: () => getScheduleTemplates(params),
  });
};

export const useCreateScheduleTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleTemplateDto) =>
      createScheduleTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduleTemplateKeys.allTemplates(),
      });
    },
  });
};

export const useUpdateScheduleTemplate = (templateId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateScheduleTemplateDto) =>
      updateScheduleTemplate(templateId, data),
    onSuccess: () => invalidateScheduleCaches(queryClient),
  });
};

export const useMoveScheduleTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      weekday,
    }: {
      templateId: string;
      weekday: Weekday;
    }) => updateScheduleTemplate(templateId, { weekday }),
    onSuccess: () => invalidateScheduleCaches(queryClient),
  });
};

export const useDeleteScheduleTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) => deleteScheduleTemplate(templateId),
    onSuccess: () => invalidateScheduleCaches(queryClient),
  });
};

// ─── Calendar ─────────────────────────────────────────────────────────────────
export const useScheduleCalendar = (params: {
  groupId: string;
  year: number;
  month: number;
}) => {
  return useQuery({
    queryKey: scheduleTemplateKeys.calendar(params),
    queryFn: () => getScheduleCalendar(params),
    enabled: !!params.groupId,
  });
};

export const useGenerateSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateSessionsDto) => generateSessions(data),
    onSuccess: () => invalidateScheduleCaches(queryClient),
  });
};

// ─── Exceptions ───────────────────────────────────────────────────────────────
export const useCreateException = (templateId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExceptionDto) =>
      createException(templateId, data),
    onSuccess: () => invalidateScheduleCaches(queryClient),
  });
};

export const useUpdateException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      exceptionId,
      data,
    }: {
      exceptionId: string;
      data: UpdateExceptionDto;
    }) => updateException(exceptionId, data),
    onSuccess: () => invalidateScheduleCaches(queryClient),
  });
};

export const useDeleteException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exceptionId: string) => deleteException(exceptionId),
    onSuccess: () => invalidateScheduleCaches(queryClient),
  });
};
