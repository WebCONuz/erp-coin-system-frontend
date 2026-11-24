import { AppSidebar } from "./AppSidebar";
import { useAdminNavItems } from "./useAdminNavItems";

/** Desktop (lg+) sidebar. Mobilda `AdminBottomNav` ishlatiladi. */
export function AdminSidebar() {
  const navItems = useAdminNavItems();
  return <AppSidebar items={navItems} storageKey="admin_sidebar_collapsed" />;
}
