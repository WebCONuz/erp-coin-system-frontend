import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduleTemplateKeys.allTemplates(),
      });
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduleTemplateKeys.allTemplates(),
      });
    },
  });
};

export const useDeleteScheduleTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) => deleteScheduleTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduleTemplateKeys.allTemplates(),
      });
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["schedule-calendar"],
      });
    },
  });
};

// ─── Exceptions ───────────────────────────────────────────────────────────────
export const useCreateException = (templateId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExceptionDto) =>
      createException(templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-calendar"] });
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-calendar"] });
    },
  });
};

export const useDeleteException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exceptionId: string) => deleteException(exceptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-calendar"] });
    },
  });
};
