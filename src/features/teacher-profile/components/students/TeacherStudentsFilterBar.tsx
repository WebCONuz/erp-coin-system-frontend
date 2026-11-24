import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { OptionSelect } from "@/components/ui/option-select";
import { TEXT_LIMITS } from "@/ustils";
import { useMyTaughtGroups } from "../../hooks";

const ALL_VALUE = "all";

export const TeacherStudentsFilterBar = () => {
  const { t } = useTranslation();
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
    <div
      role="search"
      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5"
    >
      <OptionSelect
        value={groupId}
        onValueChange={setGroupId}
        options={[
          { value: ALL_VALUE, label: t("sessions.filter.allGroups") },
          ...(groups ?? []).map((g) => ({ value: g.id, label: g.name })),
        ]}
        placeholder={t("sessions.form.groupPlaceholder")}
        className="h-9 w-full sm:w-52"
      />

      <div className="relative w-full sm:w-72">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          defaultValue={search}
          maxLength={TEXT_LIMITS.SEARCH}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("teacherProfile.students.searchPlaceholder")}
          aria-label={t("teacherProfile.students.searchPlaceholder")}
          className="h-9 pl-9"
        />
      </div>
    </div>
  );
};
