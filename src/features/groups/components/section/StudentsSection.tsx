import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, UserPlus } from "lucide-react";
import { StudentTable } from "./StudentTable";
import type { GroupDetail } from "../../types";
import { BulkGiveCoinModal } from "@/features/students/components/modal";

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
  const [search, setSearch] = useState("");
  const [bulkCoinOpen, setBulkCoinOpen] = useState(false);

  const bulkCoinStudents = useMemo(
    () =>
      group.students.map((gs) => ({
        id: gs.student.id,
        fullName: gs.student.fullName,
        phone: gs.student.phone,
      })),
    [group.students],
  );

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        {/* title */}
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            O'quvchilar
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {group.students.length} ta o'quvchi
          </p>
        </div>

        {/* actions */}
        <div className="flex gap-x-2">
          <Input
            className="h-10 bg-white w-65 px-4"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={() => setBulkCoinOpen(true)}
            disabled={!group.students.length}
            size="default"
            className="h-10 gap-2 bg-linear-to-br from-amber-500 to-amber-600 text-white disabled:opacity-50"
          >
            <Coins className="w-4 h-4" />
            Tanga berish
          </Button>
          <Button
            onClick={() => setIsAddStudentOpen(true)}
            disabled={isFull}
            size="default"
            className="h-10 gap-2 bg-linear-to-br from-purple-500 to-purple-700 text-white disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {isFull ? "Guruh to'lgan" : "Student qo'shish"}
          </Button>
        </div>
      </div>

      {/* students list */}
      <StudentTable group={group} search={search} />

      <BulkGiveCoinModal
        open={bulkCoinOpen}
        onClose={() => setBulkCoinOpen(false)}
        students={bulkCoinStudents}
        groupId={group.id}
        title="Guruhga ommaviy tanga berish"
        subtitle={`${group.name} guruhi o'quvchilariga birdaniga tanga bering`}
      />
    </div>
  );
};
