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
import { ControlledSelect } from "@/components/controls";
import { formatDate } from "@/ustils";
import { getSessionTypeLabels } from "@/features/sessions/constants";
import {
  useSessionRoomOptions,
  useUpdateSession,
} from "@/features/sessions/hooks";
import type { SessionItem } from "@/features/sessions/types";
import {
  createTeacherSessionInfoFormSchema,
  type TeacherSessionInfoFormValues,
} from "../../schema";

interface Props {
  session: SessionItem;
}

export const TeacherSessionInfoCard = ({ session }: Props) => {
  const { t } = useTranslation();
  const isLocked = session.isLocked;
  const updateSession = useUpdateSession(session.id);
  const { data: rooms } = useSessionRoomOptions();
  const sessionTypeLabels = getSessionTypeLabels(t);

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

  const onSubmit = (values: TeacherSessionInfoFormValues) => {
    const metadata = { topic: values.topic || undefined };

    // Qulflangan sessionda backend faqat metama'lumot (topic)ni qabul qiladi —
    // struktura maydonlari (vaqt/xona) shu paytda so'rovga qo'shilsa, 403 qaytadi.
    const payload = isLocked ? metadata : { ...values, ...metadata };

    updateSession.mutate(payload, {
      onSuccess: () => toast.success(t("sessions.infoUpdated")),
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  const roomOptions =
    rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? [];

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-forest text-paper">
            {sessionTypeLabels[session.sessionType] ?? session.sessionType}
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
        </div>
        <span className="text-sm text-ink-soft">
          {formatDate(session.sessionDate)}
        </span>
      </div>

      <div>
        <p className="text-sm text-ink-soft">{t("common.group")}</p>
        <p className="text-sm font-medium text-ink">{session.group.name}</p>
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

          <ControlledSelect
            control={form.control}
            name="roomId"
            label={t("common.room")}
            options={roomOptions}
            disabled={isLocked}
          />

          {isLocked && (
            <p className="text-xs text-ink-soft">
              {t("sessions.lockedFieldsHint")}
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
                    disabled={isLocked}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isLocked && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateSession.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
              >
                {updateSession.isPending
                  ? t("common.saving")
                  : t("common.save")}
              </button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
