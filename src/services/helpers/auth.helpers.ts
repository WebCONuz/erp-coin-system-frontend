/**
 * Tizimdan avtomatik chiqarish (Auto Logout)
 */
export function handleAutoLogout() {
  localStorage.removeItem("is_authenticated");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}
