import { useQuery } from "@tanstack/react-query";
import { getTeacherCalendar } from "../api";
import { teacherSelfKeys } from "../constants";

export const useTeacherCalendar = (params: {
  groupId: string;
  year: number;
  month: number;
}) => {
  return useQuery({
    queryKey: teacherSelfKeys.myCalendar(params),
    queryFn: () => getTeacherCalendar(params),
    enabled: !!params.groupId,
  });
};
