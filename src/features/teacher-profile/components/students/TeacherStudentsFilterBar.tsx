import { useSearchParams } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyTaughtGroups } from "../../hooks";

const ALL_VALUE = "all";

export const TeacherStudentsFilterBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: groups } = useMyTaughtGroups();

  const groupId = searchParams.get("groupId") ?? ALL_VALUE;
  const search = searchParams.get("search") ?? "";

  const setGroupId = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === ALL_VALUE) next.delete("groupId");
    else next.set("groupId", value);
    setSearchParams(next, { replace: true });
  };

  const setSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("search", value);
    else next.delete("search");
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={groupId} onValueChange={setGroupId}>
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Guruhni tanlang" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Barcha guruhlar</SelectItem>
          {(groups ?? []).map((g) => (
            <SelectItem key={g.id} value={g.id}>
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative">
        <SearchIcon
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50"
        />
        <input
          defaultValue={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="O'quvchi qidirish..."
          className="w-64 rounded-xl border border-ink/10 bg-white pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 outline-none focus:border-gold/50"
        />
      </div>
    </div>
  );
};
