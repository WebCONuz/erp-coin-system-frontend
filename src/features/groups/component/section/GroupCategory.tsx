import { MoreVertical, Plus } from "lucide-react";
import { courseData } from "../../constants";
import { Button } from "@/components/ui/button";

export const GroupCategory = () => {
  return (
    <aside className="flex flex-col gap-y-2.5 rounded-2xl bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold pb-3">Kurslar</h3>
      <div className="py-2 px-3 cursor-pointer text-lg font-medium rounded-md bg-bg-primary dark:bg-black hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20">
        Barchasi
      </div>
      {courseData.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-2 px-3 cursor-pointer text-lg font-medium rounded-md bg-bg-primary dark:bg-black hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
        >
          <span>{item.title}</span>
          <button>
            <MoreVertical size={20} />
          </button>
        </div>
      ))}
      <Button className="mt-2 h-12 flex items-center gap-x-2 justify-center text-lg font-medium rounded-md bg-primary/90 hover:bg-primary text-white">
        <Plus />
        <span>Kurs qo'shish</span>
      </Button>
    </aside>
  );
};
