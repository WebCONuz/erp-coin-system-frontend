import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  ChangeEmployeePasswordDto,
  CreateEmployeeDto,
  Employee,
  EmployeeDetail,
  EmployeesResponse,
  UpdateEmployeeDto,
} from "../types";

export const getAllEmployees = async (
  params?: Record<string, string | undefined>,
): Promise<EmployeesResponse> => {
  const res = await request.get<EmployeesResponse>(ENDPOINTS.STAFF, {
    params,
  });
  return res.data;
};

export const getEmployeeById = async (id: string): Promise<EmployeeDetail> => {
  const res = await request.get<EmployeeDetail>(`${ENDPOINTS.USERS}/${id}`);
  return res.data;
};

export const createEmployee = async (
  data: CreateEmployeeDto,
): Promise<Employee> => {
  const res = await request.post<Employee>(ENDPOINTS.USERS, data);
  return res.data;
};

export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeDto,
): Promise<Employee> => {
  const res = await request.patch<Employee>(`${ENDPOINTS.USERS}/${id}`, data);
  return res.data;
};

export const changeEmployeePassword = async (
  id: string,
  data: ChangeEmployeePasswordDto,
): Promise<{ message: string }> => {
  const res = await request.patch<{ message: string }>(
    `${ENDPOINTS.USERS}/${id}/change-password`,
    data,
  );
  return res.data;
};

export const archiveEmployee = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await request.delete<{ message: string }>(
    `${ENDPOINTS.USERS}/${id}`,
  );
  return res.data;
};

export const restoreEmployee = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await request.patch<{ message: string }>(
    `${ENDPOINTS.USERS}/${id}/restore`,
  );
  return res.data;
};
