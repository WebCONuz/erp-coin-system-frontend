import { Button } from "@/components/ui/button";
import { MoreVertical, Plus } from "lucide-react";

const gifts = [
  {
    id: 1,
    name: "Kitoblar",
  },
  {
    id: 2,
    name: "Sport tovarlari",
  },
  {
    id: 3,
    name: "Texnika",
  },
  {
    id: 4,
    name: "O'quv qurollar",
  },
];
export const GiftCategory = () => {
  return (
    <aside className="flex flex-col gap-y-2.5 rounded-2xl bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold pb-3">KATEGORIYALAR</h3>
      <div className="py-2 px-3 cursor-pointer text-lg font-medium rounded-md bg-bg-primary dark:bg-black hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20">
        Barchasi
      </div>
      {gifts.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-2 px-3 cursor-pointer text-lg font-medium rounded-md bg-bg-primary dark:bg-black hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
        >
          <span>{item.name}</span>
          <button>
            <MoreVertical size={20} />
          </button>
        </div>
      ))}
      <Button className="mt-2 h-12 flex items-center gap-x-2 justify-center text-lg font-medium rounded-md bg-primary/90 hover:bg-primary text-white">
        <Plus />
        <span>Kategoriya qo'shish</span>
      </Button>
    </aside>
  );
};
