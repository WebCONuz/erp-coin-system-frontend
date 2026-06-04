import { TENANT_KEY } from "@/features/tenants/constants";

/**
 * Tizimdan avtomatik chiqarish (Auto Logout)
 */
export function handleAutoLogout() {
  localStorage.removeItem("is_authenticated");
  localStorage.removeItem(TENANT_KEY);

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}
