import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CoinIcon } from "@/components/shared/coin";
import { BulkGiveCoinModal } from "@/features/students/components/modal";
import { StudentTable } from "./StudentTable";
import type { GroupDetail } from "../../types";

interface Props {
  group: GroupDetail;
  isFull: boolean;
  setIsAddStudentOpen: (open: boolean) => void;
}

export const StudentsSection = ({
  group,
  isFull,
  setIsAddStudentOpen,
}: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [bulkCoinOpen, setBulkCoinOpen] = useState(false);

  const bulkCoinStudents = useMemo(
    () =>
      group.students.map((gs) => ({
        id: gs.student.id,
        fullName: gs.student.fullName,
        phone: gs.student.phone ?? "",
      })),
    [group.students],
  );

  return (
    <section aria-labelledby="group-students-title" className="min-w-0 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="group-students-title"
            className="font-heading text-lg font-semibold"
          >
            {t("groups.students.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("groups.students.count", { count: group.students.length })}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setBulkCoinOpen(true)}
            disabled={!group.students.length}
            className="h-9 flex-1 gap-2 sm:flex-none"
          >
            <CoinIcon className="size-4" />
            {t("groups.students.giveCoin")}
          </Button>
          <Button
            onClick={() => setIsAddStudentOpen(true)}
            disabled={isFull}
            className="h-9 flex-1 gap-2 sm:flex-none"
          >
            <UserPlus className="size-4" aria-hidden />
            {isFull
              ? t("groups.students.groupFull")
              : t("groups.addStudent.title")}
          </Button>
        </div>
      </div>

      {group.students.length > 0 && (
        <div role="search" className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            className="h-9 pl-9"
            placeholder={t("common.search")}
            aria-label={t("common.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      <StudentTable group={group} search={search} />

      <BulkGiveCoinModal
        open={bulkCoinOpen}
        onClose={() => setBulkCoinOpen(false)}
        students={bulkCoinStudents}
        groupId={group.id}
        title={t("groups.students.bulkCoinTitle")}
        subtitle={t("groups.students.bulkCoinSubtitle", { name: group.name })}
      />
    </section>
  );
};
