import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
import { ControlledDatePicker, ControlledSelect } from "@/components/controls";
import { createSessionFormSchema, type SessionFormValues } from "../schema";
import {
  useCreateSession,
  useSessionGroupOptions,
  useSessionRoomOptions,
  useSessionSubjectOptions,
  useSessionTeacherOptions,
} from "../hooks";
import { getSessionTypeOptions } from "../constants";

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyValues: SessionFormValues = {
  sessionDate: "",
  startTime: "",
  endTime: "",
  sessionType: "lesson",
  groupId: "",
  roomId: "",
  teacherId: "",
  subjectId: "",
  topic: "",
};

export const SessionFormModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createSession = useCreateSession();

  const { data: groups } = useSessionGroupOptions(open);
  const { data: rooms } = useSessionRoomOptions(open);
  const { data: teachers } = useSessionTeacherOptions(open);
  const { data: subjects } = useSessionSubjectOptions(open);

  const sessionFormSchema = useMemo(() => createSessionFormSchema(t), [t]);
  const sessionTypeOptions = getSessionTypeOptions(t);

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(emptyValues);
  }, [open, form]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

  const onSubmit = (values: SessionFormValues) => {
    const data = {
      ...values,
      topic: values.topic || undefined,
      subjectId: values.subjectId || undefined,
    };

    createSession.mutate(data, {
      onSuccess: (session) => {
        onClose();
        navigate(`/admin/sessions/${session.id}`);
      },
      onError,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-110 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {t("sessions.form.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ControlledDatePicker
                control={form.control}
                name="sessionDate"
                placeholder={t("common.date")}
                className="min-w-42"
                buttonClassName="h-8"
                label={t("sessions.form.dateLabel")}
              />
              <ControlledSelect
                control={form.control}
                name="sessionType"
                label={t("sessions.form.typeLabel")}
                options={sessionTypeOptions}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
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
                control={form.control}
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

            <ControlledSelect
              control={form.control}
              name="groupId"
              label={t("common.group")}
              options={
                groups?.data.map((g) => ({ value: g.id, label: g.name })) ?? []
              }
              placeholder={t("sessions.form.groupPlaceholder")}
            />

            <div className="grid grid-cols-2 gap-3">
              <ControlledSelect
                control={form.control}
                name="roomId"
                label={t("common.room")}
                options={
                  rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? []
                }
                placeholder={t("sessions.form.roomPlaceholder")}
              />
              <ControlledSelect
                control={form.control}
                name="teacherId"
                label={t("common.teacher")}
                options={
                  teachers?.data.map((tch) => ({
                    value: tch.id,
                    label: tch.fullName,
                  })) ?? []
                }
                placeholder={t("sessions.form.teacherPlaceholder")}
              />
            </div>

            <ControlledSelect
              control={form.control}
              name="subjectId"
              label={t("sessions.subjectLabelOptional")}
              options={
                subjects?.data.map((s) => ({
                  value: s.id,
                  label: s.name,
                })) ?? []
              }
              placeholder={t("sessions.form.subjectPlaceholder")}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("sessions.form.topicLabelOptional")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("sessions.topicPlaceholder")}
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createSession.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={createSession.isPending}>
                {createSession.isPending
                  ? t("common.creating")
                  : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
