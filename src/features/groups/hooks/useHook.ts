import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseKeys, groupKeys } from "../constants";
import {
  getAllCourses,
  createGroup,
  getAllGroups,
  updateGroup,
  getGroupById,
  addStudent,
  bulkAddStudents,
  removeStudent,
} from "../api";
import type {
  AddStudentDto,
  BulkAddStudentsDto,
  CreateGroupDto,
  UpdateGroupDto,
} from "../types";

// COURSES
export const useCourses = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: courseKeys.allCourses(params),
    queryFn: () => getAllCourses(params),
  });
};

// GROUPS
export const useGroups = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: groupKeys.allGroups(params),
    queryFn: () => getAllGroups(params),
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupDto) => createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.allGroups() });
    },
  });
};

export const useUpdateGroup = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGroupDto) => updateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.allGroups() });
      queryClient.invalidateQueries({
        queryKey: groupKeys.oneGroupById(groupId),
      });
    },
  });
};

export const useGroup = (groupId: string) => {
  console.log(groupId, "++++++");

  return useQuery({
    queryKey: groupKeys.oneGroupById(groupId),
    queryFn: () => getGroupById(groupId),
    enabled: !!groupId,
  });
};

export const useAddStudent = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddStudentDto) => addStudent(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.oneGroupById(groupId),
      });
    },
  });
};

export const useBulkAddStudents = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkAddStudentsDto) => bulkAddStudents(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.oneGroupById(groupId),
      });
    },
  });
};

export const useRemoveStudent = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: string) => removeStudent(groupId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.oneGroupById(groupId),
      });
    },
  });
};
