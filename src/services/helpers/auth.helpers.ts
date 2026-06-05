import { TENANT_KEY } from "@/features/tenants/constants";

/**
 * LocaleStorage'ni tozalash
 */
export function clearLocalStoragaData() {
  localStorage.removeItem("is_authenticated");
  localStorage.removeItem(TENANT_KEY);
}

/**
 * Tizimdan avtomatik chiqarish (Auto Logout)
 */
export function handleAutoLogout() {
  clearLocalStoragaData();

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}
