import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { subjectKeys } from "../constants";
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  updateSubject,
} from "../api";
import type { CreateSubjectDto, UpdateSubjectDto } from "../types";

export const useSubjects = () => {
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
    limit: "50",
  };

  return useQuery({
    queryKey: subjectKeys.allSubjects(params),
    queryFn: () => getAllSubjects(params),
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubjectDto) => createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.allSubjects() });
    },
  });
};

export const useUpdateSubject = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSubjectDto) => updateSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.allSubjects() });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.allSubjects() });
    },
  });
};
