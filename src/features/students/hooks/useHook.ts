import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGroups } from "@/features/groups/api";
import { dashboardKeys } from "@/features/dashboard/constants";
import { auditLogKeys } from "@/features/audit-logs/constants";
import {
  createStudent,
  updateStudent,
  getAllStudents,
  getStudentById,
  deactivateStudent,
  changeStudentPassword,
  addStudentToGroup,
  removeStudentFromGroup,
  manualCoinTransaction,
  bulkManualCoinTransaction,
  applyCoinRule,
  cancelCoinTransaction,
  getCoinTransactionHistory,
  sendMessage,
} from "../api/student.api";
import { studentKeys } from "../constants";
import type {
  CreateStudentDto,
  UpdateStudentDto,
  DeactivateStudentDto,
  ChangePasswordDto,
  CoinTransactionManualDto,
  BulkManualCoinDto,
  ApplyCoinRuleDto,
  SendMessageDto,
} from "../types";
import { useSearchParams } from "react-router-dom";
import { useIdempotencyKey } from "@/hooks";

// ─── Queries ──────────────────────────────────────────────────────────────────
// `overrides` — URL paramlaridan ustun turadigan qiymatlar (masalan guruhga
// qo'shish oynasida faqat faol o'quvchilar: `{ isActive: "true" }`).
// `limit` backendda ko'pi bilan 100.
export const useStudents = (
  limit?: number,
  overrides?: Record<string, string | undefined>,
) => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const params = {
    search: searchParams.get("search") || undefined,
    groupId: searchParams.get("groupId") || undefined,
    isActive:
      status === "archive" ? "false" : status === "active" ? "true" : undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder: searchParams.get("sortOrder") || undefined,
    page: searchParams.get("page") || undefined,
    limit: limit?.toString() || "20",
    ...overrides,
  };
  return useQuery({
    queryKey: studentKeys.allStudents(params),
    queryFn: () => getAllStudents(params),
  });
};

// Guruhlar dropdown'i uchun — URL search paramlaridan mustaqil holda
// to'liq faol guruhlar ro'yxatini oladi (useGroups() sahifaning o'z
// filtr paramlarini o'qiydi, shu sababli bu yerda ishlatib bo'lmaydi).
export const useStudentGroupOptions = () => {
  return useQuery({
    queryKey: ["student-filter-groups"],
    queryFn: () => getAllGroups({ isActive: "true" }),
  });
};

export const useStudentById = (id: string) => {
  return useQuery({
    queryKey: studentKeys.oneStudentById(id),
    queryFn: () => getStudentById(id),
    enabled: !!id,
  });
};

export const useCoinTransactionHistory = (
  params?: Record<string, string | undefined>,
) => {
  return useQuery({
    queryKey: studentKeys.coinTransactions(params),
    queryFn: () => getCoinTransactionHistory(params),
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentDto) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
    },
  });
};

export const useUpdateStudent = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStudentDto) => updateStudent(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
      queryClient.invalidateQueries({
        queryKey: studentKeys.oneStudentById(studentId),
      });
    },
  });
};

export const useDeactivateStudent = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeactivateStudentDto) =>
      deactivateStudent(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
      queryClient.invalidateQueries({
        queryKey: studentKeys.oneStudentById(studentId),
      });
      // Arxivlash / o'chirish / tiklash audit log'ga yoziladi ("Tarix" tab).
      queryClient.invalidateQueries({
        queryKey: auditLogKeys.allAuditLogs(),
      });
    },
  });
};

export const useChangeStudentPassword = (studentId: string) => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) =>
      changeStudentPassword(studentId, data),
  });
};

export const useAddStudentToGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      studentId,
    }: {
      groupId: string;
      studentId: string;
    }) => addStudentToGroup(groupId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
    },
  });
};

export const useRemoveStudentFromGroup = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId }: { groupId: string }) =>
      removeStudentFromGroup(groupId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.oneStudentById(studentId),
      });
    },
  });
};

// Coin mutatsiyalari `Idempotency-Key` bilan: kalit muvaffaqiyatgacha bir xil
// qoladi (qayta bosish / qayta urinish coinni ikki marta bermaydi).
export const useManualCoinTransaction = (studentId: string) => {
  const queryClient = useQueryClient();
  const idempotency = useIdempotencyKey();
  return useMutation({
    mutationFn: (data: CoinTransactionManualDto) =>
      manualCoinTransaction(data, idempotency.getKey()),
    onSettled: (_res, error) => idempotency.settle(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.oneStudentById(studentId),
      });
      queryClient.invalidateQueries({
        queryKey: studentKeys.coinTransactions(),
      });
    },
  });
};

export const useBulkManualCoinTransaction = () => {
  const queryClient = useQueryClient();
  const idempotency = useIdempotencyKey();
  return useMutation({
    mutationFn: (data: BulkManualCoinDto) =>
      bulkManualCoinTransaction(data, idempotency.getKey()),
    onSettled: (_res, error) => idempotency.settle(error),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
      queryClient.invalidateQueries({ queryKey: studentKeys.coinTransactions() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.admin() });
      variables.studentIds.forEach((studentId) => {
        queryClient.invalidateQueries({
          queryKey: studentKeys.oneStudentById(studentId),
        });
      });
    },
  });
};

export const useApplyCoinRule = () => {
  const queryClient = useQueryClient();
  const idempotency = useIdempotencyKey();
  return useMutation({
    mutationFn: (data: ApplyCoinRuleDto) =>
      applyCoinRule(data, idempotency.getKey()),
    onSettled: (_res, error) => idempotency.settle(error),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
      queryClient.invalidateQueries({ queryKey: studentKeys.coinTransactions() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.admin() });
      variables.studentIds.forEach((studentId) => {
        queryClient.invalidateQueries({
          queryKey: studentKeys.oneStudentById(studentId),
        });
      });
    },
  });
};

export const useCancelCoinTransaction = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelCoinTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.oneStudentById(studentId),
      });
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.admin() });
      queryClient.invalidateQueries({
        queryKey: studentKeys.coinTransactions(),
      });
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (data: SendMessageDto) => sendMessage(data),
  });
};
