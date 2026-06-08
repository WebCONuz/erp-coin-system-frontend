import { Eye, Pencil, Trash } from "lucide-react";
import type { GroupItem } from "../../types";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/ustils";
import { useNavigate } from "react-router-dom";

interface Props {
  data: GroupItem;
  handleEdit: (group: GroupItem) => void;
}
export const GroupCard = ({ data, handleEdit }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className={`${
        data.isActive
          ? "border-primary/30 dark:primary-900"
          : "border-red-100 dark:border-red-900"
      } border p-4 bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md relative`}
    >
      <div className="absolute top-4 right-5 flex gap-x-2.5">
        <Eye
          size="17"
          className="text-blue-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
          onClick={() => navigate(`/admin/groups/${data.id ?? ""}`)}
        />
        <Pencil
          size="17"
          className="text-green-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
          onClick={() => handleEdit(data)}
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
