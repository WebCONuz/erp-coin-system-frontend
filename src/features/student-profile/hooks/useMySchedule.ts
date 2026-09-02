import { useQuery } from "@tanstack/react-query";
import { getMyCalendar } from "../api";
import { studentSelfKeys } from "../constants";

export const useMySchedule = (params: { year: number; month: number }) => {
  return useQuery({
    queryKey: studentSelfKeys.myCalendar(params),
    queryFn: () => getMyCalendar(params),
  });
};
