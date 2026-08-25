import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  AttendanceRecord,
  CreateSessionDto,
  LockSessionResponse,
  SaveAttendanceDto,
  SaveAttendanceResponse,
  SessionItem,
  SessionsResponse,
  UnlockSessionResponse,
  UpdateSessionDto,
} from "../types";

export const getAllSessions = async (
  params?: Record<string, string | undefined>,
): Promise<SessionsResponse> => {
  const res = await request.get<SessionsResponse>(ENDPOINTS.SESSIONS, {
    params,
  });
  return res.data;
};

export const getSessionById = async (id: string): Promise<SessionItem> => {
  const res = await request.get<SessionItem>(`${ENDPOINTS.SESSIONS}/${id}`);
  return res.data;
};

export const createSession = async (
  data: CreateSessionDto,
): Promise<SessionItem> => {
  const res = await request.post<SessionItem>(ENDPOINTS.SESSIONS, data);
  return res.data;
};

export const updateSession = async (
  id: string,
  data: UpdateSessionDto,
): Promise<SessionItem> => {
  const res = await request.patch<SessionItem>(
    `${ENDPOINTS.SESSIONS}/${id}`,
    data,
  );
  return res.data;
};

export const deleteSession = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await request.delete<{ message: string }>(
    `${ENDPOINTS.SESSIONS}/${id}`,
  );
  return res.data;
};

export const getAttendance = async (
  id: string,
): Promise<AttendanceRecord[]> => {
  const res = await request.get<AttendanceRecord[]>(
    `${ENDPOINTS.SESSIONS}/${id}/attendance`,
  );
  return res.data;
};

export const saveAttendance = async (
  id: string,
  data: SaveAttendanceDto,
): Promise<SaveAttendanceResponse> => {
  const res = await request.post<SaveAttendanceResponse>(
    `${ENDPOINTS.SESSIONS}/${id}/attendance`,
    data,
  );
  return res.data;
};

export const lockSession = async (
  id: string,
): Promise<LockSessionResponse> => {
  const res = await request.post<LockSessionResponse>(
    `${ENDPOINTS.SESSIONS}/${id}/lock`,
  );
  return res.data;
};

export const unlockSession = async (
  id: string,
): Promise<UnlockSessionResponse> => {
  const res = await request.post<UnlockSessionResponse>(
    `${ENDPOINTS.SESSIONS}/${id}/unlock`,
  );
  return res.data;
};
