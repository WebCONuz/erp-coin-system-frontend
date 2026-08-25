import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/loading";
import { useGroup } from "@/features/groups/hooks";
import { useAttendance, useSaveAttendance } from "../hooks";
import type { AttendanceRecordInput } from "../types";

interface Props {
  sessionId: string;
  groupId?: string;
  isLocked: boolean;
}

type LocalRecord = { isPresent: boolean; homeworkDone: boolean };

export const AttendanceTable = ({ sessionId, groupId, isLocked }: Props) => {
  const { data: group, isLoading: isGroupLoading } = useGroup(groupId ?? "");
  const { data: attendance, isLoading: isAttendanceLoading } =
    useAttendance(sessionId);
  const saveAttendance = useSaveAttendance(sessionId);

  const [records, setRecords] = useState<Record<string, LocalRecord>>({});

  useEffect(() => {
    if (!group) return;

    const byStudentId = new Map((attendance ?? []).map((r) => [r.student.id, r]));
    const next: Record<string, LocalRecord> = {};
    group.students.forEach(({ student }) => {
      const existing = byStudentId.get(student.id);
      next[student.id] = {
        isPresent: existing?.isPresent ?? false,
        homeworkDone: existing?.homeworkDone ?? false,
      };
    });
    setRecords(next);
  }, [group, attendance]);

  const toggle = (studentId: string, field: keyof LocalRecord) => {
    if (isLocked) return;
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: !prev[studentId][field] },
    }));
  };

  const handleSave = () => {
    const payload: AttendanceRecordInput[] = Object.entries(records).map(
      ([studentId, r]) => ({ studentId, ...r }),
    );

    saveAttendance.mutate(
      { records: payload },
      {
        onSuccess: (res) => toast.success(res.message),
        onError: (error: any) =>
          toast.error(error?.data?.message || "Xatolik yuz berdi"),
      },
    );
  };

  if (!groupId) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Guruh aniqlanmadi
      </p>
    );
  }

  if (isGroupLoading || isAttendanceLoading) return <PageLoading />;

  if (!group?.students.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Guruhda o'quvchilar mavjud emas
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">O'quvchi</th>
              <th className="px-4 py-2.5 text-left font-medium">Telefon</th>
              <th className="px-4 py-2.5 text-center font-medium">Keldi</th>
              <th className="px-4 py-2.5 text-center font-medium">
                Uy vazifasi
              </th>
            </tr>
          </thead>
          <tbody>
            {group.students.map(({ student }) => {
              const record = records[student.id] ?? {
                isPresent: false,
                homeworkDone: false,
              };

              return (
                <tr
                  key={student.id}
                  className="border-t border-gray-200 dark:border-white/10"
                >
                  <td className="px-4 py-2.5">{student.fullName}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {student.phone}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Checkbox
                      checked={record.isPresent}
                      disabled={isLocked}
                      onCheckedChange={() => toggle(student.id, "isPresent")}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Checkbox
                      checked={record.homeworkDone}
                      disabled={isLocked}
                      onCheckedChange={() =>
                        toggle(student.id, "homeworkDone")
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!isLocked && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saveAttendance.isPending}>
            {saveAttendance.isPending ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      )}
    </div>
  );
};
