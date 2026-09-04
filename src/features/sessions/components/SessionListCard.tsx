import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  DoorOpen,
  Lock,
  MoreVertical,
  Trash,
  UsersRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/ustils";
import { sessionTypeLabels } from "../constants";
import type { SessionItem } from "../types";

interface Props {
  data: SessionItem;
  onDelete?: (session: SessionItem) => void;
  hasAction?: boolean;
}

const TYPE_BADGE_CLASS: Record<string, string> = {
  lesson: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  exam: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
  trial: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
};

export const SessionListCard = ({
  data,
  onDelete,
  hasAction = true,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/admin/sessions/${data.id}`)}
      className="border rounded-xl p-3 relative bg-white dark:bg-card cursor-pointer hover:shadow-sm transition-shadow"
    >
      {hasAction && (
        <div className="absolute top-3 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="rounded p-1 text-muted-foreground hover:bg-accent"
              >
                <MoreVertical size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(data);
                }}
              >
                <Trash />
                O'chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="flex items-center gap-2 pr-8 mb-2">
        <span
          className={`inline-block px-2 py-0.5 rounded-4xl text-xs font-medium ${
            TYPE_BADGE_CLASS[data.sessionType] ?? TYPE_BADGE_CLASS.lesson
          }`}
        >
          {sessionTypeLabels[data.sessionType] ?? data.sessionType}
        </span>
        {data.isLocked && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-4xl text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Lock size={11} />
            Qulflangan
          </span>
        )}
        {data.subject && (
          <span className="inline-block px-2 py-0.5 rounded-4xl text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
            {data.subject.name}
          </span>
        )}
      </div>

      <h4 className="text-base font-semibold leading-5 mb-2 truncate">
        {data.group.name}
      </h4>

      <div className="space-y-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          <span>{formatDate(data.sessionDate)}</span>
          <Clock size={14} className="ml-2" />
          <span>
            {data.startTime} - {data.endTime}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <DoorOpen size={14} />
          <span>{data.room.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <UsersRound size={14} />
          <span>{data.teacher.fullName}</span>
        </div>
      </div>

      {data.topic && (
        <p className="text-sm mt-2 line-clamp-2 border-t pt-2">
          Mavzu: {data.topic}
        </p>
      )}
    </div>
  );
};
