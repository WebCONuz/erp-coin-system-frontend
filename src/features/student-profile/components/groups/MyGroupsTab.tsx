import { Users } from "lucide-react";
import { PageLoading } from "@/components/loading";
import { EmptyState } from "@/features/students/components/ui";
import { useMyGroups } from "../../hooks";
import { MyGroupCard } from "./MyGroupCard";

export const MyGroupsTab = () => {
  const { data: groups, isLoading } = useMyGroups();

  if (isLoading) return <PageLoading />;

  if (!groups?.length) {
    return (
      <EmptyState
        icon={<Users size={20} />}
        title="Guruhlar mavjud emas"
        text="Siz hozircha hech qanday guruhga a'zo emassiz."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <MyGroupCard key={group.membershipId} data={group} />
      ))}
    </div>
  );
};
