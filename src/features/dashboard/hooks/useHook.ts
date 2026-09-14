import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api";
import { dashboardKeys } from "../constants";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.admin(),
    queryFn: getAdminDashboard,
  });
};
