import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  archiveTeacher,
  changeTeacherPassword,
  createTeacher,
  getAllTeachers,
  getTeacherById,
  restoreTeacher,
  updateTeacher,
} from "../api/teachers.api";
import { teacherKeys } from "../constants";
import type {
  ChangeTeacherPasswordDto,
  CreateTeacherDto,
  UpdateTeacherDto,
} from "../types";

export const useTeachers = () => {
  const [searchParams] = useSearchParams();
  const params = {
    search: searchParams.get("search") || undefined,
    isActive:
      searchParams.get("status") === "archive"
        ? "false"
        : searchParams.get("status") === "active"
          ? "true"
          : undefined,
    page: searchParams.get("page") || undefined,
  };

  return useQuery({
    queryKey: teacherKeys.allTeachers(params),
    queryFn: () => getAllTeachers(params),
  });
};

export const useTeacherById = (id: string) => {
  return useQuery({
    queryKey: teacherKeys.oneTeacherById(id),
    queryFn: () => getTeacherById(id),
    enabled: !!id,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherDto) => createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.allTeachers() });
    },
  });
};

export const useUpdateTeacher = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeacherDto) => updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.allTeachers() });
      queryClient.invalidateQueries({
        queryKey: teacherKeys.oneTeacherById(id),
      });
    },
  });
};

export const useArchiveTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveTeacher(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.allTeachers() });
      queryClient.invalidateQueries({
        queryKey: teacherKeys.oneTeacherById(id),
      });
    },
  });
};

export const useRestoreTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreTeacher(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.allTeachers() });
      queryClient.invalidateQueries({
        queryKey: teacherKeys.oneTeacherById(id),
      });
    },
  });
};

export const useChangeTeacherPassword = (id: string) => {
  return useMutation({
    mutationFn: (data: ChangeTeacherPasswordDto) =>
      changeTeacherPassword(id, data),
  });
};
