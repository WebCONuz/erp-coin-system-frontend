import { useQuery } from "@tanstack/react-query";
import { tenantQueryKeys } from "../constants";
import { getAllTenants } from "../api/tenants.api";

export const useAllTenants = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: tenantQueryKeys.allTenants(params),
    queryFn: () => getAllTenants(params),
  });
};
