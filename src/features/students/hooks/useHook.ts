import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "../api/student.api";
import { studentKeys } from "../constants";

export const useStudents = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: studentKeys.allStudents(params),
    queryFn: () => getAllStudents(params),
  });
};
