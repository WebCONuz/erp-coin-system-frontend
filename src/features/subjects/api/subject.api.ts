import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CreateSubjectDto,
  Subject,
  SubjectsResponse,
  UpdateSubjectDto,
} from "../types";

export const getAllSubjects = async (
  params?: Record<string, string | undefined>,
): Promise<SubjectsResponse> => {
  const res = await request.get<SubjectsResponse>(ENDPOINTS.SUBJECTS, {
    params,
  });
  return res.data;
};

export const getSubjectById = async (id: string): Promise<Subject> => {
  const res = await request.get<Subject>(`${ENDPOINTS.SUBJECTS}/${id}`);
  return res.data;
};

export const createSubject = async (
  data: CreateSubjectDto,
): Promise<Subject> => {
  const res = await request.post<Subject>(ENDPOINTS.SUBJECTS, data);
  return res.data;
};

export const updateSubject = async (
  id: string,
  data: UpdateSubjectDto,
): Promise<Subject> => {
  const res = await request.patch<Subject>(
    `${ENDPOINTS.SUBJECTS}/${id}`,
    data,
  );
  return res.data;
};

export const deleteSubject = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await request.delete<{ message: string }>(
    `${ENDPOINTS.SUBJECTS}/${id}`,
  );
  return res.data;
};
