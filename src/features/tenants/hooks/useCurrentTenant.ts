import { useSearchParams } from "react-router-dom";
import { ROLES } from "@/assets/constants";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { TENANT_KEY } from "../constants";
import { useTenant } from "./useHook";

// Admin o'z tenantiga biriktirilgan (user.tenantId), super_admin/creator esa
// AdminNavbar orqali tenantni almashtiradi (?tenantId= / localStorage[TENANT_KEY]).
export const useCurrentTenant = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const isMultiTenant =
    user?.role?.name === ROLES.SUPER_ADMIN || user?.role?.name === ROLES.CREATOR;

  const tenantId = isMultiTenant
    ? (searchParams.get("tenantId") ??
      localStorage.getItem(TENANT_KEY) ??
      undefined)
    : user?.tenantId;

  const { data: tenant, isLoading } = useTenant(tenantId);

  return {
    tenant,
    isLoading,
    isLearningCenter: tenant?.type === "learning_center",
  };
};
