import { useQuery } from "@tanstack/react-query";
import { getMyAttendance } from "../api";
import { studentSelfKeys } from "../constants";
import type { MyAttendanceParams } from "../types";

export const useMyAttendance = (params?: MyAttendanceParams) => {
  return useQuery({
    queryKey: studentSelfKeys.myAttendance(params),
    queryFn: () => getMyAttendance(params),
  });
};
