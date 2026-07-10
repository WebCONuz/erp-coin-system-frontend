import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStudent,
  updateStudent,
  getAllStudents,
  getStudentById,
  deactivateStudent,
  changeStudentPassword,
  uploadStudentAvatar,
  addStudentToGroup,
  removeStudentFromGroup,
  manualCoinTransaction,
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
  SendMessageDto,
  UpdatePurchaseStatusDto,
} from "../types";

// ─── Queries ──────────────────────────────────────────────────────────────────
export const useStudents = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: studentKeys.allStudents(params),
    queryFn: () => getAllStudents(params),
  });
};

export const useStudentById = (id: string) => {
  return useQuery({
    queryKey: studentKeys.oneStudentById(id),
    queryFn: () => getStudentById(id),
    enabled: !!id,
  });
};

export const useCoinTransactionHistory = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: studentKeys.coinTransactions(params),
    queryFn: () => getCoinTransactionHistory(params),
  });
};

export const useStudentPurchases = (params?: Record<string, string | undefined>) => {
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
      queryClient.invalidateQueries({ queryKey: studentKeys.oneStudentById(studentId) });
    },
  });
};

export const useDeactivateStudent = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeactivateStudentDto) => deactivateStudent(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.allStudents() });
      queryClient.invalidateQueries({ queryKey: studentKeys.oneStudentById(studentId) });
    },
  });
};

export const useChangeStudentPassword = (studentId: string) => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => changeStudentPassword(studentId, data),
  });
};

export const useUploadStudentAvatar = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadStudentAvatar(studentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.oneStudentById(studentId) });
    },
  });
};

export const useAddStudentToGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, studentId }: { groupId: string; studentId: string }) =>
      addStudentToGroup(groupId, studentId),
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
      queryClient.invalidateQueries({ queryKey: studentKeys.oneStudentById(studentId) });
    },
  });
};

export const useManualCoinTransaction = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CoinTransactionManualDto) => manualCoinTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.oneStudentById(studentId) });
      queryClient.invalidateQueries({ queryKey: studentKeys.coinTransactions() });
    },
  });
};

export const useCancelCoinTransaction = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelCoinTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.oneStudentById(studentId) });
      queryClient.invalidateQueries({ queryKey: studentKeys.coinTransactions() });
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
