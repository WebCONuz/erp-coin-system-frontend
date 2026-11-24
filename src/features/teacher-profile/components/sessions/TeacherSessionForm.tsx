import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Clock, Lock } from "lucide-react";

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
import { ControlledSelect } from "@/components/controls";
import { ConfirmModal } from "@/components/shared/modal";
import { formatDate, translateApiError } from "@/ustils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useSessionEvaluation,
  useSessionRoomOptions,
  useUpdateSession,
} from "@/features/sessions/hooks";
import { SessionEvaluationPanel } from "@/features/sessions/components";
import type { SessionItem } from "@/features/sessions/types";
import {
  getAttendanceEditableUntil,
  isAttendanceEditWindowExpired,
} from "@/features/sessions/utils";
import {
  createTeacherSessionInfoFormSchema,
  type TeacherSessionInfoFormValues,
} from "../../schema";

interface Props {
  session: SessionItem;
}

export const TeacherSessionForm = ({ session }: Props) => {
  const { t } = useTranslation();
  const isLocked = session.isLocked;
  const isChecked = session.isChecked;
  // Teacher saqlangan yo'qlamani birinchi saqlashdan (`checkedAt`) keyin 3 kun
  // ichida tahrirlay oladi; keyin — faqat ko'rish (backend
  // ATTENDANCE_EDIT_WINDOW_EXPIRED). Admin qulflagan bo'lsa ham faqat ko'rish.
  const editableUntil = getAttendanceEditableUntil(session.checkedAt);
  const isEditWindowExpired =
    isChecked && isAttendanceEditWindowExpired(session.checkedAt);
  const readOnly = isLocked || isEditWindowExpired;

  const updateSession = useUpdateSession(session.id);
  const evaluation = useSessionEvaluation({ session, readOnly });
  const { data: rooms } = useSessionRoomOptions();

  const [pendingValues, setPendingValues] =
    useState<TeacherSessionInfoFormValues | null>(null);

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
      onSuccess: () => {
        toast.success(t("sessions.infoUpdated"));
        evaluation.save();
      },
      onError: (error) => toast.error(translateApiError(error, t)),
    });
  };

  const handleSubmit = (values: TeacherSessionInfoFormValues) => {
    if (evaluation.hasErrors) {
      toast.error(t("sessions.results.fixErrors"));
      return;
    }
    setPendingValues(values);
  };

  const handleConfirmSave = () => {
    if (!pendingValues) return;
    performSave(pendingValues);
    setPendingValues(null);
  };

  const roomOptions =
    rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? [];

  const isSaving = updateSession.isPending || evaluation.isSaving;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Yo'qlama — asosiy ish (birinchi). Scored jadvalda ustunlar ko'p —
              u to'liq kenglikda chiqadi. */}
          <div
            className={cn(
              "grid grid-cols-1 items-start gap-4 sm:gap-5",
              !evaluation.isScored &&
                "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
            )}
          >
            <SessionEvaluationPanel
              evaluation={evaluation}
              disabled={readOnly}
              tone="admin"
            />

            {/* Session info panel */}
            <section
              aria-labelledby="teacher-session-info-title"
              className="min-w-0 space-y-4 rounded-2xl border bg-card p-4 sm:p-5"
            >
              <h2
                id="teacher-session-info-title"
                className="font-heading text-base font-semibold"
              >
                {t("sessions.detail.infoTitle")}
              </h2>

              {!isLocked && isChecked && editableUntil && !isEditWindowExpired && (
                <p className="flex items-start gap-2 rounded-lg bg-info-soft px-3 py-2 text-xs text-foreground">
                  <Clock className="mt-px size-3.5 shrink-0 text-info" aria-hidden />
                  {t("sessions.teacherForm.editableUntil", {
                    date: formatDate(editableUntil, "dd.MM.yyyy HH:mm"),
                  })}
                </p>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                  <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {isLocked
                    ? t("sessions.lockedFieldsHint")
                    : t("sessions.teacherForm.editWindowExpiredHint")}
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
                        className="h-20 resize-none"
                        {...field}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>

          {!readOnly && (
            // Yopishqoq saqlash paneli: uzun ro'yxatda ham tugma doim ko'rinadi.
            <div className="sticky bottom-20 z-10 lg:bottom-4">
              <div className="flex items-center justify-end gap-3 rounded-2xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
                <Button
                  type="submit"
                  // Dars boshlanmagan — saqlab bo'lmaydi (backend SESSION_NOT_STARTED).
                  disabled={
                    isSaving || evaluation.hasErrors || !evaluation.hasStarted
                  }
                  className="h-10 min-w-32 px-5"
                >
                  {isSaving
                    ? t("common.saving")
                    : t("sessions.teacherForm.saveAction")}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>

      <ConfirmModal
        open={!!pendingValues}
        onClose={() => setPendingValues(null)}
        onConfirm={handleConfirmSave}
        variant="warning"
        title={t("sessions.teacherForm.confirmTitle")}
        description={t("sessions.teacherForm.confirmDescription")}
        confirmLabel={t("sessions.teacherForm.confirmAction")}
      />
    </>
  );
};
