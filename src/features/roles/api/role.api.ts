import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { CreateRoleDto, Role, RolesResponse, UpdateRoleDto } from "../types";

export const getAllRoles = async (
  params?: Record<string, string | undefined>,
): Promise<RolesResponse> => {
  const res = await request.get<RolesResponse>(ENDPOINTS.ROLES, { params });
  return res.data;
};

export const createRole = async (data: CreateRoleDto): Promise<Role> => {
  const res = await request.post<Role>(ENDPOINTS.ROLES, data);
  return res.data;
};

export const updateRole = async (
  id: string,
  data: UpdateRoleDto,
): Promise<Role> => {
  const res = await request.patch<Role>(`${ENDPOINTS.ROLES}/${id}`, data);
  return res.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await request.delete(`${ENDPOINTS.ROLES}/${id}`);
};
