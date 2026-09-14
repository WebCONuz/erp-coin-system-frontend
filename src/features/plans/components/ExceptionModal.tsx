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
import type { CalendarDayEntry } from "../types";
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

  const rescheduleForm = useForm<RescheduleExceptionFormValues>({
    resolver: zodResolver(rescheduleExceptionFormSchema),
    defaultValues: { startTime: "", endTime: "", note: "" },
  });

  useEffect(() => {
    if (!open || !entry) return;

    if (entry.exception?.isCancelled) {
      setView("cancel");
      cancelForm.reset({ note: entry.exception.note ?? "" });
    } else if (entry.exception) {
      setView("reschedule");
      rescheduleForm.reset({
        startTime: entry.exception.startTime ?? entry.template.startTime,
        endTime: entry.exception.endTime ?? entry.template.endTime,
        note: entry.exception.note ?? "",
      });
    } else {
      setView("choose");
      cancelForm.reset({ note: "" });
      rescheduleForm.reset({
        startTime: entry.template.startTime,
        endTime: entry.template.endTime,
        note: "",
      });
    }
  }, [open, entry]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

  const submitCancel = (values: CancelExceptionFormValues) => {
    if (hasException && entry?.exception) {
      updateException.mutate(
        {
          exceptionId: entry.exception.id,
          data: { isCancelled: true, note: values.note },
        },
        { onSuccess: () => onClose(), onError },
      );
    } else {
      createException.mutate(
        { exceptionDate: dateKey, isCancelled: true, note: values.note },
        { onSuccess: () => onClose(), onError },
      );
    }
  };

  const submitReschedule = (values: RescheduleExceptionFormValues) => {
    if (hasException && entry?.exception) {
      updateException.mutate(
        {
          exceptionId: entry.exception.id,
          data: { isCancelled: false, ...values },
        },
        { onSuccess: () => onClose(), onError },
      );
    } else {
      createException.mutate(
        { exceptionDate: dateKey, isCancelled: false, ...values },
        { onSuccess: () => onClose(), onError },
      );
    }
  };

  const handleRevert = () => {
    if (!entry?.exception) return;
    if (!window.confirm(t("plans.exception.revertConfirm"))) return;

    deleteException.mutate(entry.exception.id, {
      onSuccess: () => onClose(),
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
              {t("plans.exception.rescheduleTime")}
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
