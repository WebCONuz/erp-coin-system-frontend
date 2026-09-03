import { useQuery } from "@tanstack/react-query";
import { getMyTeacherDashboard } from "../api";
import { teacherSelfKeys } from "../constants";

export const useTeacherDashboard = () => {
  return useQuery({
    queryKey: teacherSelfKeys.dashboard(),
    queryFn: getMyTeacherDashboard,
  });
};
