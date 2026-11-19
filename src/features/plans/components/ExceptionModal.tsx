import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Ban, Clock, Link } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { translateApiError } from "@/ustils";
import {
  useSessionRoomOptions,
  useSessionTeacherOptions,
} from "@/features/sessions/hooks";
import { notifySessionSync } from "../lib/session-sync";
import {
  createCancelExceptionFormSchema,
  createRescheduleExceptionFormSchema,
  type CancelExceptionFormValues,
  type RescheduleExceptionFormValues,
} from "../schema";
import {
  useCreateException,
  useDeleteException,
  useUpdateException,
} from "../hooks";
import type {
  CalendarDayEntry,
  SessionSync,
  UpdateExceptionDto,
} from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  dateKey: string;
  entry: CalendarDayEntry | null;
}

type View = "choose" | "cancel" | "reschedule";

export const ExceptionModal = ({ open, onClose, dateKey, entry }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("choose");
  const hasException = !!entry?.exception;

  const createException = useCreateException(entry?.template.id ?? "");
  const updateException = useUpdateException();
  const deleteException = useDeleteException();
  const { data: rooms } = useSessionRoomOptions(open);
  const { data: teachers } = useSessionTeacherOptions(open);
  const isPending =
    createException.isPending ||
    updateException.isPending ||
    deleteException.isPending;

  const cancelExceptionFormSchema = useMemo(
    () => createCancelExceptionFormSchema(t),
    [t],
  );
  const rescheduleExceptionFormSchema = useMemo(
    () => createRescheduleExceptionFormSchema(t),
    [t],
  );

  const cancelForm = useForm<CancelExceptionFormValues>({
    resolver: zodResolver(cancelExceptionFormSchema),
    defaultValues: { note: "" },
  });

  const emptyModify: RescheduleExceptionFormValues = {
    startTime: "",
    endTime: "",
    roomId: "",
    teacherId: "",
    note: "",
  };
  const rescheduleForm = useForm<RescheduleExceptionFormValues>({
    resolver: zodResolver(rescheduleExceptionFormSchema),
    defaultValues: emptyModify,
  });

  useEffect(() => {
    if (!open || !entry) return;

    if (entry.exception?.isCancelled) {
      setView("cancel");
      cancelForm.reset({ note: entry.exception.note ?? "" });
    } else if (entry.exception) {
      setView("reschedule");
      // Bo'sh maydon — shablondagisi (vaqt/xona/o'qituvchi o'zgarmagan).
      rescheduleForm.reset({
        startTime: entry.exception.startTime ?? "",
        endTime: entry.exception.endTime ?? "",
        roomId: entry.exception.room?.id ?? "",
        teacherId: entry.exception.teacher?.id ?? "",
        note: entry.exception.note ?? "",
      });
    } else {
      setView("choose");
      cancelForm.reset({ note: "" });
      rescheduleForm.reset(emptyModify);
    }
  }, [open, entry]);

  const onError = (error: unknown) => toast.error(translateApiError(error, t));

  // Istisno shu sanadagi generatsiya qilingan darsni ham moslashtiradi.
  const onDone = (res: { sessionSync?: SessionSync }) => {
    notifySessionSync(res.sessionSync, t);
    onClose();
  };

  const submitCancel = (values: CancelExceptionFormValues) => {
    if (hasException && entry?.exception) {
      updateException.mutate(
        {
          exceptionId: entry.exception.id,
          data: { isCancelled: true, note: values.note },
        },
        { onSuccess: onDone, onError },
      );
    } else {
      createException.mutate(
        { exceptionDate: dateKey, isCancelled: true, note: values.note },
        { onSuccess: onDone, onError },
      );
    }
  };

  const submitReschedule = (values: RescheduleExceptionFormValues) => {
    const note = values.note || undefined;

    if (hasException && entry?.exception) {
      const prev = entry.exception;
      // PATCH: `null` — shablondagisiga qaytarish (o'qituvchi/xona). Vaqt
      // tozalansa, avval vaqt o'zgargan bo'lsa — `null` bilan qaytariladi.
      const data: UpdateExceptionDto = {
        isCancelled: false,
        note,
        teacherId: values.teacherId || null,
        roomId: values.roomId || null,
      };
      if (values.startTime) {
        data.startTime = values.startTime;
        data.endTime = values.endTime;
      } else if (prev.startTime || prev.endTime) {
        data.startTime = null;
        data.endTime = null;
      }
      updateException.mutate(
        { exceptionId: prev.id, data },
        { onSuccess: onDone, onError },
      );
    } else {
      createException.mutate(
        {
          exceptionDate: dateKey,
          isCancelled: false,
          note,
          ...(values.startTime && {
            startTime: values.startTime,
            endTime: values.endTime,
          }),
          ...(values.roomId && { roomId: values.roomId }),
          ...(values.teacherId && { teacherId: values.teacherId }),
        },
        { onSuccess: onDone, onError },
      );
    }
  };

  const roomOptions =
    rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? [];
  const teacherOptions =
    teachers?.data.map((tch) => ({ value: tch.id, label: tch.fullName })) ?? [];

  const handleRevert = () => {
    if (!entry?.exception) return;
    if (!window.confirm(t("plans.exception.revertConfirm"))) return;

    deleteException.mutate(entry.exception.id, {
      onSuccess: onDone,
      onError,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>{dateKey}</DialogTitle>
        </DialogHeader>

        {view === "choose" && (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => setView("cancel")}
            >
              <Ban size={16} className="text-red-500" />
              {t("plans.exception.cancelSession")}
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => setView("reschedule")}
            >
              <Clock size={16} className="text-amber-500" />
              {t("plans.exception.modifySession")}
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() =>
                navigate(`/admin/sessions/${entry?.session?.id ?? ""}`)
              }
              disabled={!entry?.session?.id}
            >
              <Link size={16} className="text-blue-500" />
              {!!entry?.session?.id
                ? t("plans.exception.goToSessionDetails")
                : t("plans.exception.noSessionYet")}
            </Button>
          </div>
        )}

        {view === "cancel" && (
          <Form {...cancelForm}>
            <form
              onSubmit={cancelForm.handleSubmit(submitCancel)}
              className="space-y-4"
            >
              <FormField
                control={cancelForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.description")} {t("common.optional")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("plans.exception.cancelReasonPlaceholder")}
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                {hasException && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="mr-auto text-muted-foreground"
                    disabled={isPending}
                    onClick={handleRevert}
                  >
                    {t("plans.exception.revertToTemplate")}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => (hasException ? onClose() : setView("choose"))}
                >
                  {hasException ? t("common.close") : t("plans.exception.back")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isPending ? t("common.saving") : t("common.confirm")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {view === "reschedule" && (
          <Form {...rescheduleForm}>
            <form
              onSubmit={rescheduleForm.handleSubmit(submitReschedule)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={rescheduleForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("sessions.startTimeLabel")}</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={rescheduleForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("sessions.endTimeLabel")}</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {t("plans.exception.templateDefaults", {
                  time: `${entry?.template.startTime ?? ""}–${entry?.template.endTime ?? ""}`,
                  room: entry?.template.room.name ?? "—",
                  teacher: entry?.template.teacher?.fullName ?? "—",
                })}
              </p>

              <ControlledSelect
                control={rescheduleForm.control}
                name="roomId"
                label={`${t("plans.exception.roomLabel")} ${t("common.optional")}`}
                options={roomOptions}
                placeholder={t("plans.exception.sameAsTemplate")}
              />

              <ControlledSelect
                control={rescheduleForm.control}
                name="teacherId"
                label={`${t("plans.exception.substituteTeacherLabel")} ${t("common.optional")}`}
                options={teacherOptions}
                placeholder={t("plans.exception.sameAsTemplate")}
              />

              <FormField
                control={rescheduleForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.description")} {t("common.optional")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "plans.exception.rescheduleReasonPlaceholder",
                        )}
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                {hasException && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="mr-auto text-muted-foreground"
                    disabled={isPending}
                    onClick={handleRevert}
                  >
                    {t("plans.exception.revertToTemplate")}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => (hasException ? onClose() : setView("choose"))}
                >
                  {hasException ? t("common.close") : t("plans.exception.back")}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? t("common.saving") : t("common.save")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
