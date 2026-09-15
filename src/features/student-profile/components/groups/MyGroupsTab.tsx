import { Users } from "lucide-react";
import { PageLoading } from "@/components/loading";
import { useMyGroupsOverview } from "../../hooks/useMyGroupsOverview";
import { MyGroupCard } from "./MyGroupCard";

export const MyGroupsTab = () => {
  const { data: groups, isLoading } = useMyGroupsOverview();

  if (isLoading) return <PageLoading />;

  if (!groups.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl border border-ink/10 bg-white">
        <Users size={22} className="text-ink-soft/50 mb-2" />
        <p className="text-sm font-medium text-ink">Guruhlar mavjud emas</p>
        <p className="text-xs text-ink-soft mt-1 max-w-xs">
          Siz hozircha hech qanday guruhga a'zo emassiz.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {groups.map((group) => (
        <MyGroupCard key={group.membershipId} data={group} />
      ))}
    </div>
  );
};
