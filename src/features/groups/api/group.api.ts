import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  AddStudentDto,
  BulkAddStudentsDto,
  BulkAddStudentsResponse,
  CreateGroupDto,
  GroupDetail,
  GroupItem,
  GroupResponse,
  UpdateGroupDto,
  UpdateResponse,
} from "../types";

export const getAllGroups = async (
  params?: Record<string, string | undefined>,
): Promise<GroupResponse> => {
  const res = await request.get<GroupResponse>(ENDPOINTS.GROUPS, {
    params,
  });
  return res.data;
};

export const createGroup = async (data: CreateGroupDto): Promise<GroupItem> => {
  const response = await request.post<GroupItem>(ENDPOINTS.GROUPS, data);
  return response.data;
};

export const updateGroup = async (
  groupId: string,
  data: UpdateGroupDto,
): Promise<UpdateResponse> => {
  const response = await request.patch<UpdateResponse>(
    `${ENDPOINTS.GROUPS}/${groupId}`,
    data,
  );
  return response.data;
};

export const getGroupById = async (groupId: string): Promise<GroupDetail> => {
  const response = await request.get<GroupDetail>(
    `${ENDPOINTS.GROUPS}/${groupId}`,
  );
  return response.data;
};

export const addStudent = async (
  groupId: string,
  data: AddStudentDto,
): Promise<{ id: string }> => {
  const response = await request.post<{ id: string }>(
    `${ENDPOINTS.GROUPS}/${groupId}/students`,
    data,
  );
  return response.data;
};

export const bulkAddStudents = async (
  groupId: string,
  data: BulkAddStudentsDto,
): Promise<BulkAddStudentsResponse> => {
  const response = await request.post<BulkAddStudentsResponse>(
    `${ENDPOINTS.GROUPS}/${groupId}/students/bulk`,
    data,
  );
  return response.data;
};

export const removeStudent = async (
  groupId: string,
  studentId: string,
): Promise<void> => {
  await request.delete(`${ENDPOINTS.GROUPS}/${groupId}/${studentId}`);
};
