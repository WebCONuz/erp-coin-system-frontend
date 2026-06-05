import { Pencil, Trash } from "lucide-react";
import type { GroupItem } from "../../types";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/ustils";

interface Props {
  data: GroupItem;
}
export const GroupCard = ({ data }: Props) => {
  const { t } = useTranslation();

  return (
    <div
      className={`${
        data.isActive
          ? "border-primary/30 dark:primary-900 hover:bg-primary/10"
          : "border-red-100 dark:border-red-900 hover:bg-red-400/10"
      } border p-4 bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-xl relative`}
    >
      <div className="absolute top-4 right-5 flex gap-x-2.5">
        <Pencil
          size="17"
          className="text-green-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
        />
        <Trash
          size="17"
          className="text-red-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
        />
      </div>
      <div className="text-gray-400 mt-2 text-xs font-semibold mb-2">
        {formatDate(data.createdAt, "dd.MM.yyyy, hh:mm")}
      </div>
      <div className="flex gap-x-3 items-center">
        <div
          className={`py-0.5 px-2 text-white text-xs font-medium opacity-70 ${
            data.isActive ? "bg-primary" : "bg-red-800"
          } rounded-full`}
        >
          {data.isActive ? "Aktiv" : "No aktiv"}
        </div>
        <h4 className="text-2xl font-semibold">{data.name}</h4>
      </div>
      <div className="text-gray-400 mt-2">
        {t("groups.student_count")} {data?._count?.students || 0}
      </div>
    </div>
  );
};
