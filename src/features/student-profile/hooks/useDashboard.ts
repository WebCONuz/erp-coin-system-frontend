import { useQuery } from "@tanstack/react-query";
import { getMyDashboard } from "../api";
import { studentSelfKeys } from "../constants";

export const useDashboard = () => {
  return useQuery({
    queryKey: studentSelfKeys.dashboard(),
    queryFn: getMyDashboard,
  });
};
