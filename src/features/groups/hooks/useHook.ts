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
  createCourse,
  updateCourse,
} from "../api";
import type {
  AddStudentDto,
  BulkAddStudentsDto,
  CreateCourseDto,
  CreateGroupDto,
  UpdateCourseDto,
  UpdateGroupDto,
} from "../types";

// COURSES
export const useCourses = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: courseKeys.allCourses(params),
    queryFn: () => getAllCourses(params),
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseDto) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.allCourses() });
    },
  });
};

export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCourseDto) => updateCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.allCourses() });
      queryClient.invalidateQueries({
        queryKey: courseKeys.oneCourseById(courseId),
      });
    },
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
