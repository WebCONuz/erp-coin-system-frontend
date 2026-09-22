import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ControlledSelect } from "@/components/controls";
import { PageLoading } from "@/components/loading";
import { formatDate } from "@/ustils";
import { useGroup } from "@/features/groups/hooks";
import { groupKeys } from "@/features/groups/constants";
import { studentKeys } from "@/features/students/constants";
import {
  createSessionInfoFormSchema,
  type SessionInfoFormValues,
} from "../schema";
import {
  useAttendance,
  useSaveAttendance,
  useSessionRoomOptions,
  useSessionSubjectOptions,
  useSessionTeacherOptions,
  useUpdateSession,
} from "../hooks";
import { getSessionTypeLabels } from "../constants";
import type { AttendanceRecordInput, SessionItem } from "../types";

interface Props {
  session: SessionItem;
}

type LocalRecord = { isPresent: boolean; homeworkDone: boolean };

export const SessionForm = ({ session }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isLocked = session.isLocked;
  const updateSession = useUpdateSession(session.id);
  const saveAttendance = useSaveAttendance(session.id);
  const { data: rooms } = useSessionRoomOptions();
  const { data: teachers } = useSessionTeacherOptions();
  const { data: subjects } = useSessionSubjectOptions();
  const { data: group, isLoading: isGroupLoading } = useGroup(
    session.group.id ?? "",
  );
  const { data: attendance, isLoading: isAttendanceLoading } = useAttendance(
    session.id,
  );
  const sessionTypeLabels = getSessionTypeLabels(t);

  const [records, setRecords] = useState<Record<string, LocalRecord>>({});

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
    if (isLocked) return;
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: !prev[studentId][field] },
    }));
  };

  const toggleAll = (field: keyof LocalRecord, value: boolean) => {
    if (isLocked) return;
    setRecords((prev) => {
      const next: Record<string, LocalRecord> = {};
      for (const [studentId, record] of Object.entries(prev)) {
        next[studentId] = { ...record, [field]: value };
      }
      return next;
    });
  };

  const sessionInfoFormSchema = useMemo(
    () => createSessionInfoFormSchema(t),
    [t],
  );

  const form = useForm<SessionInfoFormValues>({
    resolver: zodResolver(sessionInfoFormSchema),
    defaultValues: {
      topic: session.topic ?? "",
      startTime: session.startTime,
      endTime: session.endTime,
      roomId: session.room.id ?? "",
      teacherId: session.teacher.id ?? "",
      subjectId: session.subject?.id ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      topic: session.topic ?? "",
      startTime: session.startTime,
      endTime: session.endTime,
      roomId: session.room.id ?? "",
      teacherId: session.teacher.id ?? "",
      subjectId: session.subject?.id ?? "",
    });
  }, [session, form]);

  const onSubmit = (values: SessionInfoFormValues) => {
    const metadata = {
      topic: values.topic || undefined,
      subjectId: values.subjectId || null,
    };

    // Qulflangan sessionda backend faqat metama'lumot (topic/subjectId)ni
    // qabul qiladi — struktura maydonlari (vaqt/xona/o'qituvchi) shu paytda
    // so'rovga qo'shilsa, 403 qaytadi.
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

          // Yo'qlama guruh a'zolarining coin balansi/statistikasiga ta'sir
          // qiladi — shu sababli guruh, talabalar ro'yxati va har bir
          // talabaning shaxsiy sahifasi keshini "eskirgan" deb belgilaymiz,
          // shunda ularga keyingi safar o'tilganda ma'lumot qayta so'raladi.
          queryClient.invalidateQueries({
            queryKey: groupKeys.oneGroupById(session.group.id ?? ""),
          });
          queryClient.invalidateQueries({
            queryKey: studentKeys.allStudents(),
          });
          group?.students.forEach(({ student }) => {
            queryClient.invalidateQueries({
              queryKey: studentKeys.oneStudentById(student.id),
            });
          });
        },
        onError: (error: any) =>
          toast.error(error?.data?.message || t("common.error")),
      },
    );
  };

  const roomOptions =
    rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? [];
  const teacherOptions =
    teachers?.data.map((tch) => ({ value: tch.id, label: tch.fullName })) ?? [];
  const subjectOptions =
    subjects?.data.map((s) => ({ value: s.id, label: s.name })) ?? [];

  const recordValues = Object.values(records);
  const allPresent =
    recordValues.length > 0 && recordValues.every((r) => r.isPresent);
  const somePresent = recordValues.some((r) => r.isPresent);
  const allHomeworkDone =
    recordValues.length > 0 && recordValues.every((r) => r.homeworkDone);
  const someHomeworkDone = recordValues.some((r) => r.homeworkDone);

  const isSaving = updateSession.isPending || saveAttendance.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Session info panel */}
          <div className="rounded-2xl bg-background p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block px-2.5 py-1 rounded-4xl text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                  {sessionTypeLabels[session.sessionType] ??
                    session.sessionType}
                </span>
                {session?.subject && (
                  <span className="inline-block px-2.5 py-1 rounded-4xl text-xs font-medium bg-purple-100 text-purple-700 dark:bg-blue-950/50 dark:text-blue-400">
                    {session.subject.name}
                  </span>
                )}
                {isLocked && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-4xl text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <Lock size={12} />
                    {t("sessions.locked")}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(session.sessionDate)}
              </span>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {t("common.group")}
              </p>
              <p className="text-sm font-medium">{session.group.name}</p>
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

            <div className="grid grid-cols-2 gap-3">
              <ControlledSelect
                control={form.control}
                name="roomId"
                label={t("common.room")}
                options={roomOptions}
                disabled={isLocked}
              />
              <ControlledSelect
                control={form.control}
                name="teacherId"
                label={t("common.teacher")}
                options={teacherOptions}
                disabled={isLocked}
              />
            </div>

            {isLocked && (
              <p className="text-xs text-muted-foreground">
                {t("sessions.lockedFieldsHint")}
              </p>
            )}

            <ControlledSelect
              control={form.control}
              name="subjectId"
              label={t("sessions.subjectLabelOptional")}
              options={subjectOptions}
              disabled={isLocked}
            />

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
                      disabled={isLocked}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Attendance panel */}
          <div className="rounded-2xl bg-background p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">
              {t("sessions.attendance.title")}
            </h3>

            {!session.group.id ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t("sessions.attendance.groupNotSet")}
              </p>
            ) : isGroupLoading || isAttendanceLoading ? (
              <PageLoading />
            ) : !group?.students.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t("sessions.attendance.noStudents")}
              </p>
            ) : (
              <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium">
                        {t("common.student")}
                      </th>
                      <th className="px-4 py-2.5 text-left font-medium">
                        {t("common.phone")}
                      </th>
                      <th className="px-4 py-2.5 text-center font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <Checkbox
                            isMinusIcon={somePresent && !allPresent}
                            checked={allPresent}
                            disabled={isLocked}
                            onCheckedChange={() =>
                              toggleAll("isPresent", !allPresent)
                            }
                          />
                          {t("sessions.attendance.present")}
                        </div>
                      </th>
                      <th className="px-4 py-2.5 text-center font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <Checkbox
                            isMinusIcon={someHomeworkDone && !allHomeworkDone}
                            checked={allHomeworkDone}
                            disabled={isLocked}
                            onCheckedChange={() =>
                              toggleAll("homeworkDone", !allHomeworkDone)
                            }
                          />
                          {t("sessions.attendance.homework")}
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
                              onCheckedChange={() =>
                                toggle(student.id, "isPresent")
                              }
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
            )}
          </div>
        </div>

        {!isLocked && (
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="h-10 px-5">
              {isSaving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
