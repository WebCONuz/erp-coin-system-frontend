import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAllGroups } from "@/features/groups/api";
import { getAllRooms } from "@/features/rooms/api";
import { getAllSubjects } from "@/features/subjects/api";
import { getAllTeachers } from "@/features/teachers/api/teachers.api";
import { dashboardKeys } from "@/features/dashboard/constants";
import { studentSelfKeys } from "@/features/student-profile/constants";
import { teacherSelfKeys } from "@/features/teacher-profile/constants";
import { sessionKeys } from "../constants";
import {
  createSession,
  deleteSession,
  getAllSessions,
  getAttendance,
  getSessionById,
  lockSession,
  saveAttendance,
  unlockSession,
  updateSession,
} from "../api";
import type {
  CreateSessionDto,
  SaveAttendanceDto,
  UpdateSessionDto,
} from "../types";

export const useSessions = () => {
  const [searchParams] = useSearchParams();
  const sessionType = searchParams.get("sessionType") || undefined;
  const params = {
    groupId: searchParams.get("groupId") || undefined,
    teacherId: searchParams.get("teacherId") || undefined,
    sessionType,
    date: searchParams.get("date") || undefined,
    // isChecked filter only applies to "lesson" type sessions.
    isChecked:
      sessionType === "lesson"
        ? searchParams.get("isChecked") || undefined
        : undefined,
    page: searchParams.get("page") || undefined,
    limit: "20",
  };

  return useQuery({
    queryKey: sessionKeys.allSessions(params),
    queryFn: () => getAllSessions(params),
  });
};

export const useSession = (id: string) => {
  return useQuery({
    queryKey: sessionKeys.oneSessionById(id),
    queryFn: () => getSessionById(id),
    enabled: !!id,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSessionDto) => createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.allSessions() });
    },
  });
};

export const useUpdateSession = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSessionDto) => updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.allSessions() });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.oneSessionById(id),
      });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.allSessions() });
    },
  });
};

export const useAttendance = (id: string) => {
  return useQuery({
    queryKey: sessionKeys.attendanceBySessionId(id),
    queryFn: () => getAttendance(id),
    enabled: !!id,
  });
};

export const useSaveAttendance = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveAttendanceDto) => saveAttendance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.attendanceBySessionId(id),
      });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.oneSessionById(id),
      });
      queryClient.invalidateQueries({ queryKey: sessionKeys.allSessions() });
      // Yo'qlama guruh a'zolarining balansi/statistikasiga ta'sir qilishi mumkin,
      // shu sababli barcha rollarning dashboardlarini ham yangilaymiz.
      queryClient.invalidateQueries({ queryKey: dashboardKeys.admin() });
      queryClient.invalidateQueries({ queryKey: teacherSelfKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: studentSelfKeys.dashboard() });
    },
  });
};

export const useLockSession = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => lockSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.oneSessionById(id),
      });
      queryClient.invalidateQueries({ queryKey: sessionKeys.allSessions() });
    },
  });
};

export const useUnlockSession = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unlockSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.oneSessionById(id),
      });
      queryClient.invalidateQueries({ queryKey: sessionKeys.allSessions() });
    },
  });
};

// ─── Form lookups ─────────────────────────────────────────────────────────────
// Fetched independently of the URL search params (the sessions page reuses
// `page`/`groupId`/etc. for its own filters, which would otherwise leak into
// these dropdown queries if we reused the groups/rooms/teachers page hooks).
export const useSessionGroupOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["session-form-groups"],
    queryFn: () => getAllGroups({ isActive: "true" }),
    enabled,
  });
};

export const useSessionRoomOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["session-form-rooms"],
    queryFn: () => getAllRooms({ isActive: "true" }),
    enabled,
  });
};

export const useSessionTeacherOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["session-form-teachers"],
    queryFn: () => getAllTeachers({}),
    enabled,
  });
};

export const useSessionSubjectOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["session-form-subjects"],
    queryFn: () => getAllSubjects({ isActive: "true", limit: "100" }),
    enabled,
  });
};
