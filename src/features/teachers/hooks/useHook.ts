import { useQuery } from "@tanstack/react-query";
import { getAllTeachers } from "../api/teachers.api";
import { teacherKeys } from "../constants";

export const useTeachers = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: teacherKeys.allTeachers(params),
    queryFn: () => getAllTeachers(params),
  });
};
