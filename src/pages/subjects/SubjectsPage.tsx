import { SubjectHeader } from "@/features/controls/components/header";
import { LessonCard } from "@/features/controls/components/ui";
import { lessons } from "@/features/controls/constants";

const SubjectsPage = () => {
  return (
    <div className="space-y-6">
      <SubjectHeader />
      <div className="grid grid-cols-3 gap-5">
        {lessons.map((item) => (
          <LessonCard data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;
