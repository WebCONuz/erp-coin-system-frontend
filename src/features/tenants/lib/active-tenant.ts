import { useSyncExternalStore } from "react";
import { TENANT_KEY } from "../constants/tenant.constants";

/**
 * super_admin/creator tanlagan faol tenant — `localStorage[TENANT_KEY]`.
 *
 * Axios interceptor uni har so'rovga `tenantId` qilib qo'shadi, QueryClient esa
 * har bir query hash'iga qo'shadi (`query-provider.tsx`), shuning uchun turli
 * tenantlarning keshi hech qachon aralashmaydi. Admin/teacher/student uchun
 * `null` (ular tokendagi tenantga bog'langan).
 */
const listeners = new Set<() => void>();

export const getActiveTenantId = () => localStorage.getItem(TENANT_KEY);

export const setActiveTenantId = (id: string | null) => {
  if (id === getActiveTenantId()) return;
  if (id) localStorage.setItem(TENANT_KEY, id);
  else localStorage.removeItem(TENANT_KEY);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useActiveTenantId = () =>
  useSyncExternalStore(subscribe, getActiveTenantId);
