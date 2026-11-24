import { useEffect, useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ControlledInput, ControlledSelect } from "@/components/controls";
import { translateApiError } from "@/ustils";
import { cn } from "@/lib/utils";
import {
  createSessionInfoFormSchema,
  type SessionInfoFormValues,
} from "../schema";
import {
  useSessionEvaluation,
  useSessionRoomOptions,
  useSessionSubjectOptions,
  useSessionTeacherOptions,
  useSessionTypes,
  useUpdateSession,
} from "../hooks";
import {
  getEvaluationModeOptions,
} from "../constants";
import type { SessionItem, UpdateSessionDto } from "../types";
import { SessionEvaluationPanel } from "./evaluation";

interface Props {
  session: SessionItem;
}

const getDefaultValues = (session: SessionItem): SessionInfoFormValues => ({
  topic: session.topic ?? "",
  startTime: session.startTime,
  endTime: session.endTime,
  roomId: session.room.id ?? "",
  teacherId: session.teacher.id ?? "",
  subjectId: session.subject?.id ?? "",
  evaluationMode: session.evaluationMode,
  maxScore: session.maxScore ? String(session.maxScore) : "",
});

export const SessionForm = ({ session }: Props) => {
  const { t } = useTranslation();
  const isLocked = session.isLocked;
  const updateSession = useUpdateSession(session.id);
  const { data: rooms } = useSessionRoomOptions();
  const { data: teachers } = useSessionTeacherOptions();
  const { data: subjects } = useSessionSubjectOptions();
  const { data: sessionTypes } = useSessionTypes();

  const [confirmResave, setConfirmResave] = useState(false);

  const sessionInfoFormSchema = useMemo(
    () => createSessionInfoFormSchema(t),
    [t],
  );

  const form = useForm<SessionInfoFormValues>({
    resolver: zodResolver(sessionInfoFormSchema),
    defaultValues: getDefaultValues(session),
  });

  useEffect(() => {
    form.reset(getDefaultValues(session));
  }, [session, form]);

  const watchedMaxScore = form.watch("maxScore");
  const formMode = form.watch("evaluationMode") ?? session.evaluationMode;
  const evaluation = useSessionEvaluation({
    session,
    readOnly: isLocked,
    maxScore: watchedMaxScore ? Number(watchedMaxScore) : null,
  });

  const typeConfig = sessionTypes?.find(
    (item) => item.type === session.sessionType,
  );
  // Tekshirilgan sessiyaning rejimini o'zgartirib bo'lmaydi (409).
  const canChooseMode =
    (typeConfig?.allowedModes.length ?? 0) > 1 &&
    !session.isChecked &&
    !isLocked;

  const onSubmit = (values: SessionInfoFormValues) => {
    const metadata = {
      topic: values.topic || undefined,
      subjectId: values.subjectId || null,
    };

    const modeChanged =
      !!values.evaluationMode &&
      values.evaluationMode !== session.evaluationMode;
    const nextMode = values.evaluationMode ?? session.evaluationMode;

    // Qulflangan sessionda backend faqat metama'lumot (topic/subjectId)ni
    // qabul qiladi — struktura maydonlari (vaqt/xona/o'qituvchi, rejim,
    // maksimal ball) shu paytda so'rovga qo'shilsa, 403 qaytadi.
    const infoPayload: UpdateSessionDto = isLocked
      ? metadata
      : {
          startTime: values.startTime,
          endTime: values.endTime,
          roomId: values.roomId,
          teacherId: values.teacherId,
          ...metadata,
          ...(modeChanged && { evaluationMode: values.evaluationMode }),
          ...(nextMode === "scored" && {
            maxScore: values.maxScore ? Number(values.maxScore) : null,
          }),
        };

    // Ma'lumotlar avval saqlanadi: rejim yoki maksimal ball o'zgargan bo'lsa,
    // tekshiruv yangi qiymatlar bo'yicha qabul qilinishi kerak.
    updateSession.mutate(infoPayload, {
      onSuccess: () => {
        toast.success(t("sessions.infoUpdated"));

        // Rejim o'zgarsa, jadval ham almashadi — tekshiruv keyin kiritiladi.
        if (modeChanged) {
          toast.info(t("sessions.evaluation.modeChangedHint"));
          return;
        }

        // Dars hali boshlanmagan — faqat ma'lumotlar saqlanadi, yo'qlama
        // keyin (backend SESSION_NOT_STARTED qaytargan bo'lardi).
        if (!evaluation.hasStarted) return;

        evaluation.save(() => setConfirmResave(false));
      },
      onError: (error) => toast.error(translateApiError(error, t)),
    });
  };

  const roomOptions =
    rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? [];
  const teacherOptions =
    teachers?.data.map((tch) => ({ value: tch.id, label: tch.fullName })) ?? [];
  const subjectOptions =
    subjects?.data.map((s) => ({ value: s.id, label: s.name })) ?? [];

  const isSaving = updateSession.isPending || evaluation.isSaving;

  const checkedBadge = session?.isChecked ? (
    <Badge variant="success">{t("sessions.form.is_checked_session")}</Badge>
  ) : (
    <Badge variant="warning">{t("sessions.form.is_not_checked_session")}</Badge>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Yo'qlama — asosiy ish, shuning uchun birinchi (mobilda ham tepada).
            Scored jadvalda ustunlar ko'p — u to'liq kenglikda chiqadi. */}
        <div
          className={cn(
            "grid grid-cols-1 items-start gap-4 sm:gap-5",
            !evaluation.isScored &&
              "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
          )}
        >
          <SessionEvaluationPanel
            evaluation={evaluation}
            disabled={isLocked}
            headerExtra={checkedBadge}
          />

          {/* Session info panel */}
          <section
            aria-labelledby="session-info-title"
            className="min-w-0 space-y-4 rounded-2xl border bg-card p-4 sm:p-5"
          >
            <h2
              id="session-info-title"
              className="font-heading text-base font-semibold"
            >
              {t("sessions.detail.infoTitle")}
            </h2>

            <div
              className={cn(
                "grid grid-cols-1 gap-3 sm:grid-cols-2",
                evaluation.isScored && "lg:grid-cols-4",
              )}
            >
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

              {canChooseMode && (
                <ControlledSelect
                  control={form.control}
                  name="evaluationMode"
                  label={t("sessions.form.evaluationModeLabel")}
                  options={getEvaluationModeOptions(
                    t,
                    typeConfig?.allowedModes ?? [],
                  )}
                />
              )}
              {formMode === "scored" && (
                <ControlledInput
                  control={form.control}
                  name="maxScore"
                  label={t("sessions.form.maxScoreLabel")}
                  placeholder={t("sessions.form.maxScorePlaceholder")}
                  inputClassName="h-9"
                  disabled={isLocked}
                  isNumber
                  maxLength={6}
                />
              )}
            </div>

            {isLocked && (
              <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
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
                      className="h-20 resize-none"
                      {...field}
                      disabled={isLocked}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </div>

        {!isLocked && (
          // Yopishqoq saqlash paneli: uzun ro'yxatda ham tugma doim ko'rinadi.
          // Mobilda pastki navigatsiya ustida turadi.
          <div className="sticky bottom-20 z-10 lg:bottom-4">
            <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 rounded-2xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
              {session.isChecked && (
                <label
                  htmlFor="confirm-resave"
                  className="mr-auto flex cursor-pointer select-none items-center gap-2 text-sm"
                >
                  <Checkbox
                    id="confirm-resave"
                    checked={confirmResave}
                    disabled={isSaving}
                    onCheckedChange={(v) => setConfirmResave(v === true)}
                  />
                  <span>
                    <span className="font-medium text-warning">
                      {t("sessions.confirmResave")}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {t("sessions.confirmResaveHint")}
                    </span>
                  </span>
                </label>
              )}
              <Button
                type="submit"
                disabled={
                  isSaving ||
                  evaluation.hasErrors ||
                  (session.isChecked && !confirmResave)
                }
                className="h-10 min-w-32 px-5"
              >
                {isSaving
                  ? t("common.saving")
                  : session?.isChecked
                    ? t("common.resave")
                    : t("common.save")}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
