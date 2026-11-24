import { useSearchParams } from "react-router-dom";
import { ROLES } from "@/assets/constants";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { TENANT_KEY } from "../constants";
import { useActiveTenantId } from "../lib";
import { useAllTenants } from "./useHook";

/**
 * super_admin/creator uchun faol tenantni aniqlaydi: `?tenantId=` →
 * saqlangan tenant → ro'yxatdagi birinchi tenant.
 *
 * Tenant tanlanmaguncha `isReady: false` — layout kontentni render qilmaydi.
 * Backend elevated rollarga `tenantId` yuborilmasa BARCHA tenantlar
 * ma'lumotini qaytaradi, shuning uchun tenantsiz so'rov umuman ketmasligi kerak.
 *
 * `tenantId` layout'ga `key` sifatida beriladi: tenant almashganda butun
 * kontent qayta mount bo'ladi va barcha query'lar yangi tenant hash'iga o'tadi.
 */
export const useEnsureActiveTenant = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const storedTenantId = useActiveTenantId();
  const isSystemUser =
    user?.role?.name === ROLES.SUPER_ADMIN ||
    user?.role?.name === ROLES.CREATOR;
  const { data: tenants, isError } = useAllTenants(isSystemUser);

  if (!isSystemUser) return { isReady: true, tenantId: null };

  const desiredTenantId =
    searchParams.get("tenantId") ||
    storedTenantId ||
    (tenants?.length ? tenants[0].id.toString() : null);

  if (desiredTenantId && desiredTenantId !== storedTenantId) {
    // Render paytida, xabar bermasdan yoziladi (idempotent): shu render'dagi
    // bolalarning so'rovlari va query hash'lari allaqachon yangi tenant bilan
    // ketadi. Store obunachisi faqat shu hook, keyingi render'da sinxronlashadi.
    localStorage.setItem(TENANT_KEY, desiredTenantId);
  }

  // Tenant yo'q (yoki ro'yxat yuklanmadi) — kutib turish ma'nosiz.
  const nothingToSelect = isError || (tenants !== undefined && !tenants.length);
  return {
    isReady: !!desiredTenantId || nothingToSelect,
    tenantId: desiredTenantId,
  };
};
