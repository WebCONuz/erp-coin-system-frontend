import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CardMenu } from "@/components/shared/card-menu";
import { Badge } from "@/components/ui/badge";
import type { Room } from "../types";

interface Props {
  data: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export const RoomCard = ({ data, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();
  return (
    <article className="relative flex h-full flex-col gap-2 rounded-2xl border bg-card p-4">
      <div className="absolute top-2.5 right-2.5">
        <CardMenu
          title={data.name}
          onEdit={() => onEdit(data)}
          onDelete={() => onDelete(data)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 pr-9">
        <h3 className="truncate font-heading text-base font-semibold">
          {data.name}
        </h3>
        {!data.isActive && (
          <Badge variant="secondary">{t("rooms.inactive")}</Badge>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Users className="size-4" aria-hidden />
        <span className="tabular-nums">
          {t("rooms.capacityUnit", { count: data.capacity })}
        </span>
      </p>

      {data.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {data.description}
        </p>
      )}
    </article>
  );
};
