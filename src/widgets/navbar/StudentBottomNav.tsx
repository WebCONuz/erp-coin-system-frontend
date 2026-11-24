import { useStudentNavItems } from "@/widgets/sidebar/useStudentNavItems";
import { SimpleBottomNav } from "./SimpleBottomNav";

export function StudentBottomNav() {
  const items = useStudentNavItems();
  return <SimpleBottomNav items={items} />;
}
