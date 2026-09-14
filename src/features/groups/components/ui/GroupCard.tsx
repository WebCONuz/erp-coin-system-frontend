import { Eye, Pencil, Trash, Users } from "lucide-react";
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
    <div className="border p-3 bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md relative">
      <div className="absolute bottom-5 right-4 flex gap-x-2.5">
        <Eye
          size="16"
          className="text-gray-500 hover:text-blue-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
          onClick={() =>
            navigate(
              `/admin/groups${!!data.id ? "/" + data.id + "?groupId=" + data.id : ""}`,
            )
          }
        />
        <Pencil
          size="16"
          className="text-gray-500 hover:text-green-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
          onClick={() => handleEdit(data)}
        />
        <Trash
          size="16"
          className="text-gray-500 hover:text-red-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
        />
      </div>
      <div className="flex gap-x-3 items-center mt-1">
        <Users size={24} className="text-purple-600" />
        <h4 className="text-2xl font-semibold">{data.name}</h4>
        <div
          className={`py-px px-1.5 text-white text-[10px] font-medium opacity-70 bg-linear-to-br ${
            data.isActive
              ? "from-green-600 to-green-800"
              : "from-red-600 to-red-800"
          } rounded-full`}
        >
          {data.isActive ? t("groups.card.active") : t("groups.card.inactive")}
        </div>
      </div>
      <div className="text-gray-400 text-sm mt-2">
        {t("groups.student_count")} {data?._count?.students || 0}
      </div>
      <div className="text-gray-500 text-sm font-semibold">
        {t("groups.info.created_at")}{" "}
        {formatDate(data.createdAt, "dd.MM.yyyy, hh:mm")}
      </div>
    </div>
  );
};
