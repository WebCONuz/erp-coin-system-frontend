import { DoorOpen, MoreVertical, Pencil, Trash, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Room } from "../types";

interface Props {
  data: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export const RoomCard = ({ data, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="border rounded-xl p-3 relative bg-gray-100 dark:bg-card">
      <div className="absolute top-3 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded p-1 text-muted-foreground hover:bg-accent">
              <MoreVertical size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(data)}>
              <Pencil className="text-blue-500" />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(data)}
            >
              <Trash />
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1 pr-8">
        <h4 className="text-lg font-semibold leading-5 truncate flex items-center gap-x-2 pb-2">
          <DoorOpen size={24} className="text-purple-600" />
          <span>{data.name}</span>
        </h4>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground pl-8">
          <Users size={14} />
          <span>{t("rooms.capacityUnit", { count: data.capacity })}</span>
        </div>

        {data.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 pl-8">
            {data.description}
          </p>
        )}

        {!data.isActive && (
          <span className="inline-block px-2 py-0.5 rounded-4xl text-xs bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
            {t("rooms.inactive")}
          </span>
        )}
      </div>
    </div>
  );
};
