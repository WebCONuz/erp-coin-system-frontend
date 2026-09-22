import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Lock } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ControlledSelect } from "@/components/controls";
import { PageLoading } from "@/components/loading";
import { ConfirmModal } from "@/components/shared/modal";
import { formatDate } from "@/ustils";
import { useGroup } from "@/features/groups/hooks";
import { getSessionTypeLabels } from "@/features/sessions/constants";
import {
  useAttendance,
  useSaveAttendance,
  useSessionRoomOptions,
  useUpdateSession,
} from "@/features/sessions/hooks";
import type {
  AttendanceRecordInput,
  SessionItem,
} from "@/features/sessions/types";
import {
  createTeacherSessionInfoFormSchema,
  type TeacherSessionInfoFormValues,
} from "../../schema";

interface Props {
  session: SessionItem;
}

type LocalRecord = { isPresent: boolean; homeworkDone: boolean };

export const TeacherSessionForm = ({ session }: Props) => {
  const { t } = useTranslation();
  const isLocked = session.isLocked;
  const isChecked = session.isChecked;
  // Admin qulflagan bo'lsa YOKI o'qituvchi yo'qlamani allaqachon tekshirib
  // saqlagan bo'lsa (isChecked) — o'qituvchi uchun forma to'liq faqat
  // o'qish uchun bo'lib qoladi; buni faqat administrator o'zgartira oladi.
  const readOnly = isLocked || isChecked;

  const updateSession = useUpdateSession(session.id);
  const saveAttendance = useSaveAttendance(session.id);
  const { data: rooms } = useSessionRoomOptions();
  const { data: group, isLoading: isGroupLoading } = useGroup(
    session.group.id ?? "",
  );
  const { data: attendance, isLoading: isAttendanceLoading } = useAttendance(
    session.id,
  );
  const sessionTypeLabels = getSessionTypeLabels(t);

  const [records, setRecords] = useState<Record<string, LocalRecord>>({});
  const [pendingValues, setPendingValues] =
    useState<TeacherSessionInfoFormValues | null>(null);

  useEffect(() => {
    if (!group) return;

    const byStudentId = new Map(
      (attendance ?? []).map((r) => [r.student.id, r]),
    );
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
    if (readOnly) return;
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: !prev[studentId][field] },
    }));
  };

  const toggleAll = (field: keyof LocalRecord, value: boolean) => {
    if (readOnly) return;
    setRecords((prev) => {
      const next: Record<string, LocalRecord> = {};
      for (const [studentId, record] of Object.entries(prev)) {
        next[studentId] = { ...record, [field]: value };
      }
      return next;
    });
  };

  const teacherSessionInfoFormSchema = useMemo(
    () => createTeacherSessionInfoFormSchema(t),
    [t],
  );

  const form = useForm<TeacherSessionInfoFormValues>({
    resolver: zodResolver(teacherSessionInfoFormSchema),
    defaultValues: {
      topic: session.topic ?? "",
      startTime: session.startTime,
      endTime: session.endTime,
      roomId: session.room.id ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      topic: session.topic ?? "",
      startTime: session.startTime,
      endTime: session.endTime,
      roomId: session.room.id ?? "",
    });
  }, [session, form]);

  const performSave = (values: TeacherSessionInfoFormValues) => {
    const metadata = { topic: values.topic || undefined };
    const infoPayload = isLocked ? metadata : { ...values, ...metadata };

    updateSession.mutate(infoPayload, {
      onSuccess: () => toast.success(t("sessions.infoUpdated")),
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });

    const attendancePayload: AttendanceRecordInput[] = Object.entries(
      records,
    ).map(([studentId, r]) => ({ studentId, ...r }));

    saveAttendance.mutate(
      { records: attendancePayload },
      {
        onSuccess: (res) => {
          toast.success(res.message);

          if (res.coinsSkippedFor?.length) {
            const nameById = new Map(
              group?.students.map(({ student }) => [
                student.id,
                student.fullName,
              ]) ?? [],
            );

            res.coinsSkippedFor.forEach((skip) => {
              toast.warning(
                `${nameById.get(skip.studentId) ?? skip.studentId}: ${skip.reason}`,
              );
            });
          }
        },
        onError: (error: any) =>
          toast.error(error?.data?.message || "Xatolik yuz berdi"),
      },
    );
  };

  const handleConfirmSave = () => {
    if (!pendingValues) return;
    performSave(pendingValues);
    setPendingValues(null);
  };

  const roomOptions =
    rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? [];

  const recordValues = Object.values(records);
  const allPresent =
    recordValues.length > 0 && recordValues.every((r) => r.isPresent);
  const somePresent = recordValues.some((r) => r.isPresent);
  const allHomeworkDone =
    recordValues.length > 0 && recordValues.every((r) => r.homeworkDone);
  const someHomeworkDone = recordValues.some((r) => r.homeworkDone);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(setPendingValues)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Session info panel */}
            <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-forest text-paper">
                    {sessionTypeLabels[session.sessionType] ??
                      session.sessionType}
                  </span>
                  {session?.subject && (
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-forest/20 text-forest">
                      {session.subject.name}
                    </span>
                  )}
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gold/15 text-gold">
                      <Lock size={12} />
                      {t("sessions.locked")}
                    </span>
                  )}
                  {!isLocked && isChecked && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-forest/15 text-forest">
                      <CheckCircle2 size={12} />
                      Tekshirilgan
                    </span>
                  )}
                </div>
                <span className="text-sm text-ink-soft">
                  {formatDate(session.sessionDate)}
                </span>
              </div>

              <div>
                <p className="text-sm text-ink-soft">{t("common.group")}</p>
                <p className="text-sm font-medium text-ink">
                  {session.group.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("sessions.startTimeLabel")}</FormLabel>
                      <FormControl>
                        <Input type="time" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("sessions.endTimeLabel")}</FormLabel>
                      <FormControl>
                        <Input type="time" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <ControlledSelect
                control={form.control}
                name="roomId"
                label={t("common.room")}
                options={roomOptions}
                disabled={readOnly}
              />

              {readOnly && (
                <p className="text-xs text-ink-soft">
                  {isLocked
                    ? t("sessions.lockedFieldsHint")
                    : "Ushbu darsning yo'qlamasi tekshirilib saqlangan. O'zgartirish kerak bo'lsa, administratorga murojaat qiling."}
                </p>
              )}

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sessions.topicLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("sessions.topicPlaceholder")}
                        className="resize-none h-20"
                        {...field}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Attendance panel */}
            <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-4">
              <h3 className="font-display text-sm font-semibold text-ink">
                Yo'qlama
              </h3>

              {!session.group.id ? (
                <p className="py-6 text-center text-sm text-ink-soft">
                  Guruh aniqlanmadi
                </p>
              ) : isGroupLoading || isAttendanceLoading ? (
                <PageLoading />
              ) : !group?.students.length ? (
                <p className="py-6 text-center text-sm text-ink-soft">
                  Guruhda o'quvchilar mavjud emas
                </p>
              ) : (
                <div className="w-full overflow-x-auto rounded-xl border border-ink/10">
                  <table className="w-full text-sm">
                    <thead className="bg-paper-soft">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-medium text-ink">
                          O'quvchi
                        </th>
                        <th className="px-4 py-2.5 text-left font-medium text-ink">
                          Telefon
                        </th>
                        <th className="px-4 py-2.5 text-center font-medium text-ink">
                          <div className="flex items-center justify-center gap-2">
                            <Checkbox
                              isMinusIcon={somePresent && !allPresent}
                              checked={allPresent}
                              disabled={readOnly}
                              onCheckedChange={() =>
                                toggleAll("isPresent", !allPresent)
                              }
                            />
                            Keldi
                          </div>
                        </th>
                        <th className="px-4 py-2.5 text-center font-medium text-ink">
                          <div className="flex items-center justify-center gap-2">
                            <Checkbox
                              isMinusIcon={someHomeworkDone && !allHomeworkDone}
                              checked={allHomeworkDone}
                              disabled={readOnly}
                              onCheckedChange={() =>
                                toggleAll("homeworkDone", !allHomeworkDone)
                              }
                            />
                            Uy vazifasi
                          </div>
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
                            className="border-t border-ink/8"
                          >
                            <td className="px-4 py-2.5 text-ink">
                              {student.fullName}
                            </td>
                            <td className="px-4 py-2.5 text-ink-soft">
                              {student.phone}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <Checkbox
                                checked={record.isPresent}
                                disabled={readOnly}
                                onCheckedChange={() =>
                                  toggle(student.id, "isPresent")
                                }
                              />
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <Checkbox
                                checked={record.homeworkDone}
                                disabled={readOnly}
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
              )}
            </div>
          </div>

          {!readOnly && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
              >
                Ma'lumotlarni saqlash
              </button>
            </div>
          )}
        </form>
      </Form>

      <ConfirmModal
        open={!!pendingValues}
        onClose={() => setPendingValues(null)}
        onConfirm={handleConfirmSave}
        variant="warning"
        title="Ma'lumotlarni saqlaysizmi?"
        description="Tasdiqlagandan so'ng dars va yo'qlama ma'lumotlarini qayta o'zgartira olmaysiz. Xatolik bo'lsa, administratorga murojaat qiling."
        confirmLabel="Ha, saqlash"
      />
    </>
  );
};
