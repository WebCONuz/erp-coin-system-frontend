import { useSearchParams } from "react-router-dom";
import { ROLES } from "@/assets/constants";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { TENANT_KEY } from "../constants";
import { useTenant } from "./useHook";

// Admin o'z tenantiga biriktirilgan (user.tenantId), super_admin/creator esa
// AdminNavbar orqali tenantni almashtiradi (?tenantId= / localStorage[TENANT_KEY]).
//
// GET /tenants/:id faqat super_admin va undan yuqori uchun ochiq (adminga 403) —
// shuning uchun bitta tenantga bog'langan rollar o'z tenantini GET /auth/me
// dagi `tenant` maydonidan oladi (qo'shimcha so'rovsiz).
export const useCurrentTenant = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const [searchParams] = useSearchParams();

  const isMultiTenant =
    user?.role?.name === ROLES.SUPER_ADMIN || user?.role?.name === ROLES.CREATOR;

  const tenantId = isMultiTenant
    ? (searchParams.get("tenantId") ??
      localStorage.getItem(TENANT_KEY) ??
      undefined)
    : undefined;

  const selectedTenant = useTenant(tenantId);

  const tenantType = isMultiTenant
    ? selectedTenant.data?.type
    : user?.tenant?.type;

  return {
    tenantType,
    isLoading: isMultiTenant ? selectedTenant.isLoading : isUserLoading,
    isLearningCenter: tenantType === "learning_center",
  };
};
