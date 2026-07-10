import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CreateStudentDto,
  UpdateStudentDto,
  DeactivateStudentDto,
  ChangePasswordDto,
  CoinTransactionManualDto,
  SendMessageDto,
  UpdatePurchaseStatusDto,
  StudentDetail,
  StudentDetailFull,
  StudentsResponse,
  CoinTransaction,
  StudentPurchase,
} from "../types";

// ─── List ─────────────────────────────────────────────────────────────────────
export const getAllStudents = async (
  params?: Record<string, string | undefined>,
): Promise<StudentsResponse> => {
  const res = await request.get<StudentsResponse>(ENDPOINTS.STUDENTS, { params });
  return res.data;
};

// ─── Detail ──────────────────────────────────────────────────────────────────
export const getStudentById = async (id: string): Promise<StudentDetailFull> => {
  const res = await request.get<StudentDetailFull>(`${ENDPOINTS.STUDENTS}/${id}`);
  return res.data;
};

// ─── Create ──────────────────────────────────────────────────────────────────
export const createStudent = async (data: CreateStudentDto): Promise<StudentDetail> => {
  const res = await request.post<StudentDetail>(ENDPOINTS.USERS, data);
  return res.data;
};

// ─── Update profile ──────────────────────────────────────────────────────────
export const updateStudent = async (id: string, data: UpdateStudentDto): Promise<StudentDetail> => {
  const res = await request.patch<StudentDetail>(`${ENDPOINTS.USERS}/${id}`, data);
  return res.data;
};

// ─── Archive / Soft-delete / Restore ─────────────────────────────────────────
export const deactivateStudent = async (id: string, data: DeactivateStudentDto): Promise<StudentDetail> => {
  const res = await request.delete<StudentDetail>(`${ENDPOINTS.STUDENTS}/${id}`, { data });
  return res.data;
};

// ─── Change password ─────────────────────────────────────────────────────────
export const changeStudentPassword = async (id: string, data: ChangePasswordDto): Promise<void> => {
  await request.patch(`${ENDPOINTS.USERS}/${id}/change-password`, data);
};

// ─── Avatar upload ───────────────────────────────────────────────────────────
export const uploadStudentAvatar = async (
  id: string,
  file: File,
): Promise<{ id: string; avatarUrl: string }> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await request.patch<{ id: string; avatarUrl: string }>(
    `${ENDPOINTS.STUDENTS}/${id}/avatar`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
};

// ─── Group membership ────────────────────────────────────────────────────────
export const addStudentToGroup = async (groupId: string, studentId: string): Promise<void> => {
  await request.post(`${ENDPOINTS.GROUPS}/${groupId}/students`, { studentId });
};

export const removeStudentFromGroup = async (groupId: string, studentId: string): Promise<void> => {
  await request.delete(`${ENDPOINTS.GROUPS}/${groupId}/students/${studentId}`);
};

// ─── Coin transactions ───────────────────────────────────────────────────────
export const manualCoinTransaction = async (data: CoinTransactionManualDto): Promise<CoinTransaction> => {
  const res = await request.post<CoinTransaction>(`${ENDPOINTS.COIN_TRANSACTIONS}/manual`, data);
  return res.data;
};

export const cancelCoinTransaction = async (id: string): Promise<void> => {
  await request.delete(`${ENDPOINTS.COIN_TRANSACTIONS}/${id}/cancel`);
};

export const getCoinTransactionHistory = async (
  params?: Record<string, string | undefined>,
): Promise<{ data: CoinTransaction[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
  const res = await request.get(`${ENDPOINTS.COIN_TRANSACTIONS}/history`, { params });
  return res.data;
};

// ─── Purchases ───────────────────────────────────────────────────────────────
export const getStudentPurchases = async (
  params?: Record<string, string | undefined>,
): Promise<{ data: StudentPurchase[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
  const res = await request.get(ENDPOINTS.PURCHASES, { params });
  return res.data;
};

export const updatePurchaseStatus = async (
  id: string,
  data: UpdatePurchaseStatusDto,
): Promise<StudentPurchase> => {
  const res = await request.patch<StudentPurchase>(`${ENDPOINTS.PURCHASES}/${id}/status`, data);
  return res.data;
};

// ─── Send message ─────────────────────────────────────────────────────────────
export const sendMessage = async (
  data: SendMessageDto,
): Promise<{ message: string; results: { channel: string; success: boolean; error?: string }[] }> => {
  const res = await request.post(`${ENDPOINTS.MESSAGES}/send`, data);
  return res.data;
};
