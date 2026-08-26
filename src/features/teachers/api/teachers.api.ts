import { request } from "@/services/api";
import type {
  ChangeTeacherPasswordDto,
  CreateTeacherDto,
  Teacher,
  TeacherDetail,
  TeacherResponse,
  UpdateTeacherDto,
} from "../types";
import { ENDPOINTS } from "@/services/endpoints";

export const getAllTeachers = async (
  params?: Record<string, string | undefined>,
): Promise<TeacherResponse> => {
  const res = await request.get<TeacherResponse>(ENDPOINTS.TEACHERS, {
    params,
  });
  return res.data;
};

export const getTeacherById = async (id: string): Promise<TeacherDetail> => {
  const res = await request.get<TeacherDetail>(`${ENDPOINTS.TEACHERS}/${id}`);
  return res.data;
};

export const createTeacher = async (
  data: CreateTeacherDto,
): Promise<Teacher> => {
  const res = await request.post<Teacher>(ENDPOINTS.USERS, data);
  return res.data;
};

export const updateTeacher = async (
  id: string,
  data: UpdateTeacherDto,
): Promise<Teacher> => {
  const res = await request.patch<Teacher>(`${ENDPOINTS.USERS}/${id}`, data);
  return res.data;
};

export const archiveTeacher = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await request.delete<{ message: string }>(
    `${ENDPOINTS.USERS}/${id}`,
  );
  return res.data;
};

export const restoreTeacher = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await request.patch<{ message: string }>(
    `${ENDPOINTS.USERS}/${id}/restore`,
  );
  return res.data;
};

export const changeTeacherPassword = async (
  id: string,
  data: ChangeTeacherPasswordDto,
): Promise<{ message: string }> => {
  const res = await request.patch<{ message: string }>(
    `${ENDPOINTS.USERS}/${id}/change-password`,
    data,
  );
  return res.data;
};
