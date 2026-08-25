import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { sessionInfoFormSchema, type SessionInfoFormValues } from "../schema";
import {
  useSessionRoomOptions,
  useSessionTeacherOptions,
  useUpdateSession,
} from "../hooks";
import { sessionTypeLabels } from "../constants";
import type { SessionItem } from "../types";

interface Props {
  session: SessionItem;
}

export const SessionInfoCard = ({ session }: Props) => {
  const isLocked = session.isLocked;
  const updateSession = useUpdateSession(session.id);
  const { data: rooms } = useSessionRoomOptions();
  const { data: teachers } = useSessionTeacherOptions();

  const form = useForm<SessionInfoFormValues>({
    resolver: zodResolver(sessionInfoFormSchema),
    defaultValues: {
      topic: session.topic ?? "",
      startTime: session.startTime,
      endTime: session.endTime,
      roomId: session.roomId ?? session.room.id ?? "",
      teacherId: session.teacherId ?? session.teacher.id ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      topic: session.topic ?? "",
      startTime: session.startTime,
      endTime: session.endTime,
      roomId: session.roomId ?? session.room.id ?? "",
      teacherId: session.teacherId ?? session.teacher.id ?? "",
    });
  }, [session, form]);

  const onSubmit = (values: SessionInfoFormValues) => {
    updateSession.mutate(
      { ...values, topic: values.topic || undefined },
      {
        onSuccess: () => toast.success("Dars ma'lumotlari yangilandi"),
        onError: (error: any) =>
          toast.error(error?.data?.message || "Xatolik yuz berdi"),
      },
    );
  };

  const roomOptions =
    rooms?.data.map((r) => ({ value: r.id, label: r.name })) ?? [];
  const teacherOptions =
    teachers?.data.map((t) => ({ value: t.id, label: t.fullName })) ?? [];

  return (
    <div className="rounded-2xl bg-background p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block px-2.5 py-1 rounded-4xl text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
            {sessionTypeLabels[session.sessionType] ?? session.sessionType}
          </span>
          {isLocked && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-4xl text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Lock size={12} />
              Qulflangan
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {formatDate(session.sessionDate)}
        </span>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Guruh</p>
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
                  <FormLabel>Boshlanish vaqti</FormLabel>
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
                  <FormLabel>Tugash vaqti</FormLabel>
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
              label="Xona"
              options={roomOptions}
              disabled={isLocked}
            />
            <ControlledSelect
              control={form.control}
              name="teacherId"
              label="O'qituvchi"
              options={teacherOptions}
              disabled={isLocked}
            />
          </div>

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mavzu</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Masalan: OOP asoslari"
                    className="resize-none h-20"
                    disabled={isLocked}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isLocked && (
            <div className="flex justify-end">
              <Button type="submit" disabled={updateSession.isPending}>
                {updateSession.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
