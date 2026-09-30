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
import { ControlledInput, ControlledSelect } from "@/components/controls";
import { formatDate, translateApiError } from "@/ustils";
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
  getSessionTypeLabel,
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
    <span className="inline-block px-2.5 py-1 rounded-4xl text-xs font-medium bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
      {t("sessions.form.is_checked_session")}
    </span>
  ) : (
    <span className="inline-block px-2.5 py-1 rounded-4xl text-xs font-medium bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
      {t("sessions.form.is_not_checked_session")}
    </span>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Scored jadvalda ustunlar ko'p — u ma'lumotlar ostida to'liq kenglikda chiqadi. */}
        <div
          className={cn(
            "grid gap-6",
            evaluation.isScored ? "grid-cols-1" : "grid-cols-2",
          )}
        >
          {/* Session info panel */}
          <div className="rounded-2xl bg-background p-6 shadow-sm space-y-4 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block px-2.5 py-1 rounded-4xl text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                  {getSessionTypeLabel(t, session.sessionType)}
                </span>
                <span className="inline-block px-2.5 py-1 rounded-4xl text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                  {t(`sessions.evaluationMode.${session.evaluationMode}`, {
                    defaultValue: session.evaluationMode,
                  })}
                </span>
                {session?.subject && (
                  <span className="inline-block px-2.5 py-1 rounded-4xl text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400">
                    {session.subject.name}
                  </span>
                )}
                {checkedBadge}
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

            {(canChooseMode || formMode === "scored") && (
              <div className="grid grid-cols-2 gap-3">
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
            )}

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

          <SessionEvaluationPanel
            evaluation={evaluation}
            disabled={isLocked}
            headerExtra={checkedBadge}
          />
        </div>

        {!isLocked && (
          <div className="flex flex-wrap items-center justify-end gap-4">
            {session.isChecked && (
              <label
                htmlFor="confirm-resave"
                title={t("sessions.confirmResaveHint")}
                className="flex cursor-pointer items-center gap-2 select-none text-sm font-medium text-orange-600 dark:text-orange-400"
              >
                <Checkbox
                  id="confirm-resave"
                  checked={confirmResave}
                  disabled={isSaving}
                  onCheckedChange={(v) => setConfirmResave(v === true)}
                />
                {t("sessions.confirmResave")}
              </label>
            )}
            <Button
              type="submit"
              disabled={
                isSaving ||
                evaluation.hasErrors ||
                (session.isChecked && !confirmResave)
              }
              className={cn(
                "h-10 px-5",
                session.isChecked &&
                  "from-orange-400 to-orange-600 sm:from-orange-400 sm:to-orange-600",
              )}
              variant="default"
            >
              {isSaving
                ? t("common.saving")
                : session?.isChecked
                  ? t("common.resave")
                  : t("common.save")}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
