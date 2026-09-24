import { useQuery } from "@tanstack/react-query";
import { TENANT_KEY } from "@/features/tenants/constants";
import { roleKeys } from "../constants";
import { getAllRoles } from "../api";

// Rollar deyarli o'zgarmaydi, shuning uchun sessiya davomida keshlanadi.
// Kalitga tenantId qo'shilgan: roleId har bir tenantda har xil, boshqa tenantning
// roleId si yuborilsa backend 400 qaytaradi.
export const useRoles = (params?: Record<string, string | undefined>) => {
  const tenantId = localStorage.getItem(TENANT_KEY) ?? undefined;

  return useQuery({
    queryKey: roleKeys.allRoles({ ...params, tenantId }),
    queryFn: () => getAllRoles(params),
    staleTime: Infinity,
  });
};
