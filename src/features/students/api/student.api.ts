import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import { idempotencyHeaders } from "@/ustils";
import type {
  CreateStudentDto,
  UpdateStudentDto,
  DeactivateStudentDto,
  ChangePasswordDto,
  CoinTransactionManualDto,
  BulkManualCoinDto,
  ApplyCoinRuleDto,
  BulkCoinResponse,
  ApplyCoinRuleResponse,
  SendMessageDto,
  SendMessageResponse,
  StudentDetail,
  StudentDetailFull,
  StudentsResponse,
  CoinTransaction,
  CoinTransactionHistoryResponse,
  CancelCoinTransactionResponse,
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
// `PATCH /students/:id/status` (eskirgan `DELETE /students/:id` body bilan o'rniga).
export const deactivateStudent = async (id: string, data: DeactivateStudentDto): Promise<StudentDetail> => {
  const res = await request.patch<StudentDetail>(`${ENDPOINTS.STUDENTS}/${id}/status`, data);
  return res.data;
};

// ─── Change password ─────────────────────────────────────────────────────────
export const changeStudentPassword = async (id: string, data: ChangePasswordDto): Promise<void> => {
  await request.patch(`${ENDPOINTS.USERS}/${id}/change-password`, data);
};

// ─── Group membership ────────────────────────────────────────────────────────
export const addStudentToGroup = async (groupId: string, studentId: string): Promise<void> => {
  await request.post(`${ENDPOINTS.GROUPS}/${groupId}/students`, { studentId });
};

export const removeStudentFromGroup = async (groupId: string, studentId: string): Promise<void> => {
  await request.delete(`${ENDPOINTS.GROUPS}/${groupId}/students/${studentId}`);
};

// ─── Coin transactions ───────────────────────────────────────────────────────
// `idempotencyKey` majburiy (yo'q bo'lsa `400 IDEMPOTENCY_KEY_REQUIRED`) —
// qayta yuborishda o'sha kalit, yangi amal uchun yangi kalit (`useIdempotencyKey`).
export const manualCoinTransaction = async (
  data: CoinTransactionManualDto,
  idempotencyKey: string,
): Promise<CoinTransaction> => {
  const res = await request.post<CoinTransaction>(
    `${ENDPOINTS.COIN_TRANSACTIONS}/manual`,
    data,
    { headers: idempotencyHeaders(idempotencyKey) },
  );
  return res.data;
};

export const bulkManualCoinTransaction = async (
  data: BulkManualCoinDto,
  idempotencyKey: string,
): Promise<BulkCoinResponse> => {
  const res = await request.post<BulkCoinResponse>(
    `${ENDPOINTS.COIN_TRANSACTIONS}/bulk-manual`,
    data,
    { headers: idempotencyHeaders(idempotencyKey) },
  );
  return res.data;
};

export const applyCoinRule = async (
  data: ApplyCoinRuleDto,
  idempotencyKey: string,
): Promise<ApplyCoinRuleResponse> => {
  const res = await request.post<ApplyCoinRuleResponse>(
    `${ENDPOINTS.COIN_TRANSACTIONS}/apply-rule`,
    data,
    { headers: idempotencyHeaders(idempotencyKey) },
  );
  return res.data;
};

// Bekor qilish — teskari yozuv yaratadi; asl yozuv tarixda qoladi.
export const cancelCoinTransaction = async (
  id: string,
): Promise<CancelCoinTransactionResponse> => {
  const res = await request.delete<CancelCoinTransactionResponse>(
    `${ENDPOINTS.COIN_TRANSACTIONS}/${id}/cancel`,
  );
  return res.data;
};

export const getCoinTransactionHistory = async (
  params?: Record<string, string | undefined>,
): Promise<CoinTransactionHistoryResponse> => {
  const res = await request.get<CoinTransactionHistoryResponse>(
    `${ENDPOINTS.COIN_TRANSACTIONS}/history`,
    { params },
  );
  return res.data;
};

// ─── Send message ─────────────────────────────────────────────────────────────
export const sendMessage = async (
  data: SendMessageDto,
): Promise<SendMessageResponse> => {
  const res = await request.post<SendMessageResponse>(`${ENDPOINTS.MESSAGES}/send`, data);
  return res.data;
};
