import { MoreVertical, Pencil, Trash, Zap, Hand, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sourceTypeLabels } from "../constants";
import type { CoinRule } from "../types";

interface Props {
  data: CoinRule;
  groupName?: string;
  onEdit: (rule: CoinRule) => void;
  onDelete: (rule: CoinRule) => void;
}

export const CoinRuleCard = ({ data, groupName, onEdit, onDelete }: Props) => {
  const isPlus = data.direction === "earn";

  return (
    <div
      className={`${
        isPlus ? "bg-green-500/10" : "bg-red-500/10"
      } rounded-xl p-4 relative`}
    >
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded p-1 text-muted-foreground hover:bg-accent/50">
              <MoreVertical size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(data)}>
              <Pencil className="text-blue-500" />
              Tahrirlash
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(data)}
            >
              <Trash />
              O'chirish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h4 className="font-medium leading-5 mb-2 pr-8">{data.name}</h4>

      <div className="flex gap-x-1 items-center mb-2">
        <img src="/logo.png" alt="coin" className="w-4 h-4" />
        <p
          className={`${
            isPlus ? "text-green-500" : "text-red-500"
          } leading-0 font-semibold`}
        >
          {isPlus ? `+${data.coinAmount}` : `-${data.coinAmount}`}
        </p>
      </div>

      {data.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {data.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-4xl text-xs bg-background/70">
          {data.triggerType === "auto" ? (
            <Zap size={12} className="text-amber-500" />
          ) : (
            <Hand size={12} className="text-blue-500" />
          )}
          {data.triggerType === "auto" ? "Avtomatik" : "Qo'lda"}
        </span>

        {data.triggerType === "auto" && data.sourceType && (
          <span className="inline-block px-2 py-0.5 rounded-4xl text-xs bg-background/70">
            {sourceTypeLabels[data.sourceType] ?? data.sourceType}
          </span>
        )}

        {groupName && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-4xl text-xs bg-background/70">
            <Users size={12} />
            {groupName}
          </span>
        )}

        {!data.isActive && (
          <span className="inline-block px-2 py-0.5 rounded-4xl text-xs bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
            Nofaol
          </span>
        )}
      </div>
    </div>
  );
};
