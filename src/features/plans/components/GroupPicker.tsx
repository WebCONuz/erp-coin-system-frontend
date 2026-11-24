import { ChevronDown, School } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  groups: { id: string; name: string }[];
  value: string;
  onChange: (groupId: string) => void;
  label: string;
}

/** Jadval/kalendar uchun guruh tanlagichi. */
export const GroupPicker = ({ groups, value, onChange, label }: Props) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 min-w-0 flex-1 justify-between gap-2 font-normal sm:w-56 sm:flex-none"
          aria-label={`${t("common.group")}: ${label}`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <School className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate">{label}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-64 overflow-y-auto">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {groups.map((group) => (
            <DropdownMenuRadioItem key={group.id} value={group.id}>
              {group.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
