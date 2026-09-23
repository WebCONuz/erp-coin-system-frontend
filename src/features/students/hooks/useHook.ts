import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGroups } from "@/features/groups/api";
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
  getStudentPurchases,
  updatePurchaseStatus,
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
  UpdatePurchaseStatusDto,
} from "../types";
import { useSearchParams } from "react-router-dom";

// ─── Queries ──────────────────────────────────────────────────────────────────
export const useStudents = (limit?: number) => {
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

export const useStudentPurchases = (
  params?: Record<string, string | undefined>,
) => {
  return useQuery({
    queryKey: studentKeys.purchases(params),
    queryFn: () => getStudentPurchases(params),
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

export const useManualCoinTransaction = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CoinTransactionManualDto) => manualCoinTransaction(data),
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
  return useMutation({
    mutationFn: (data: BulkManualCoinDto) => bulkManualCoinTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
      queryClient.invalidateQueries({ queryKey: studentKeys.coinTransactions() });
    },
  });
};

export const useApplyCoinRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ApplyCoinRuleDto) => applyCoinRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
      queryClient.invalidateQueries({ queryKey: studentKeys.coinTransactions() });
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
      queryClient.invalidateQueries({
        queryKey: studentKeys.coinTransactions(),
      });
    },
  });
};

export const useUpdatePurchaseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseStatusDto }) =>
      updatePurchaseStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.purchases() });
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (data: SendMessageDto) => sendMessage(data),
  });
};
