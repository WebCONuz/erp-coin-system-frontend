import { SubjectHeader } from "@/features/controls/components/header";
import { ReaconCard } from "@/features/controls/components/ui";
import { coinReasons } from "@/features/controls/constants";

const ReasonsPage = () => {
  return (
    <div className="space-y-6">
      <SubjectHeader />
      <div className="grid grid-cols-4 gap-5">
        {coinReasons.map((item) => (
          <ReaconCard data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default ReasonsPage;
