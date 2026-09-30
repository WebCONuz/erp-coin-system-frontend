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
import { ControlledSelect } from "@/components/controls";
import { ConfirmModal } from "@/components/shared/modal";
import { formatDate, translateApiError } from "@/ustils";
import { cn } from "@/lib/utils";
import { getSessionTypeLabel } from "@/features/sessions/constants";
import {
  useSessionEvaluation,
  useSessionRoomOptions,
  useUpdateSession,
} from "@/features/sessions/hooks";
import { SessionEvaluationPanel } from "@/features/sessions/components";
import type { SessionItem } from "@/features/sessions/types";
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
  // Admin qulflagan bo'lsa YOKI o'qituvchi tekshiruvni allaqachon saqlagan
  // bo'lsa (isChecked) — o'qituvchi uchun forma to'liq faqat o'qish uchun
  // bo'lib qoladi; buni faqat administrator o'zgartira oladi.
  const readOnly = isLocked || isChecked;

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
          {/* Scored jadvalda ustunlar ko'p — u ma'lumotlar ostida to'liq kenglikda chiqadi. */}
          <div
            className={cn(
              "grid grid-cols-1 gap-4",
              !evaluation.isScored && "lg:grid-cols-2",
            )}
          >
            {/* Session info panel */}
            <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-4 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-forest text-paper">
                    {getSessionTypeLabel(t, session.sessionType)}
                  </span>
                  {evaluation.isScored && (
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gold/15 text-gold">
                      {t("sessions.evaluationMode.scored")}
                      {session.maxScore
                        ? ` · ${t("sessions.results.maxScoreShort", {
                            maxScore: session.maxScore,
                          })}`
                        : ""}
                    </span>
                  )}
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
                      {t("sessions.filter.checked")}
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
                    : t("sessions.teacherForm.checkedReadOnlyHint")}
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

            <SessionEvaluationPanel
              evaluation={evaluation}
              disabled={readOnly}
              tone="teacher"
            />
          </div>

          {!readOnly && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving || evaluation.hasErrors}
                className="inline-flex items-center gap-2 rounded-lg bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
              >
                {isSaving
                  ? t("common.saving")
                  : t("sessions.teacherForm.saveAction")}
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
        title={t("sessions.teacherForm.confirmTitle")}
        description={t("sessions.teacherForm.confirmDescription")}
        confirmLabel={t("sessions.teacherForm.confirmAction")}
      />
    </>
  );
};
