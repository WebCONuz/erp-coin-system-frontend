import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ControlledSelect } from "@/components/controls";
import { formatDate } from "@/ustils";
import {
  createSessionInfoFormSchema,
  type SessionInfoFormValues,
} from "../schema";
import {
  useSessionRoomOptions,
  useSessionSubjectOptions,
  useSessionTeacherOptions,
  useUpdateSession,
} from "../hooks";
import { getSessionTypeLabels } from "../constants";
import type { SessionItem } from "../types";

interface Props {
  session: SessionItem;
}

export const SessionInfoCard = ({ session }: Props) => {
  const { t } = useTranslation();
  const isLocked = session.isLocked;
  const updateSession = useUpdateSession(session.id);
  const { data: rooms } = useSessionRoomOptions();
  const { data: teachers } = useSessionTeacherOptions();
  const { data: subjects } = useSessionSubjectOptions();
  const sessionTypeLabels = getSessionTypeLabels(t);

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
    const payload = isLocked ? metadata : { ...values, ...metadata };

    updateSession.mutate(payload, {
      onSuccess: () => toast.success(t("sessions.infoUpdated")),
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  const roomOptions =
    rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? [];
  const teacherOptions =
    teachers?.data.map((tch) => ({ value: tch.id, label: tch.fullName })) ?? [];
  const subjectOptions =
    subjects?.data.map((s) => ({ value: s.id, label: s.name })) ?? [];

  return (
    <div className="rounded-2xl bg-background p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block px-2.5 py-1 rounded-4xl text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
            {sessionTypeLabels[session.sessionType] ?? session.sessionType}
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
        <p className="text-sm text-muted-foreground">{t("common.group")}</p>
        <p className="text-sm font-medium">{session.group.name}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          {!isLocked && (
            <div className="flex justify-end">
              <Button type="submit" disabled={updateSession.isPending}>
                {updateSession.isPending
                  ? t("common.saving")
                  : t("common.save")}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
