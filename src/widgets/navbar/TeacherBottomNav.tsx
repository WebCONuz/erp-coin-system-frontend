import { useTeacherNavItems } from "@/widgets/sidebar/useTeacherNavItems";
import { SimpleBottomNav } from "./SimpleBottomNav";

export function TeacherBottomNav() {
  const items = useTeacherNavItems(true);
  return <SimpleBottomNav items={items} />;
}
