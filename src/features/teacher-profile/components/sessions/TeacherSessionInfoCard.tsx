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
import { ControlledSelect } from "@/components/controls";
import { formatDate } from "@/ustils";
import { sessionTypeLabels } from "@/features/sessions/constants";
import { useSessionRoomOptions, useUpdateSession } from "@/features/sessions/hooks";
import type { SessionItem } from "@/features/sessions/types";
import {
  teacherSessionInfoFormSchema,
  type TeacherSessionInfoFormValues,
} from "../../schema";

interface Props {
  session: SessionItem;
}

export const TeacherSessionInfoCard = ({ session }: Props) => {
  const isLocked = session.isLocked;
  const updateSession = useUpdateSession(session.id);
  const { data: rooms } = useSessionRoomOptions();

  const form = useForm<TeacherSessionInfoFormValues>({
    resolver: zodResolver(teacherSessionInfoFormSchema),
    defaultValues: {
      topic: session.topic ?? "",
      startTime: session.startTime,
      endTime: session.endTime,
      roomId: session.roomId ?? session.room.id ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      topic: session.topic ?? "",
      startTime: session.startTime,
      endTime: session.endTime,
      roomId: session.roomId ?? session.room.id ?? "",
    });
  }, [session, form]);

  const onSubmit = (values: TeacherSessionInfoFormValues) => {
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

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-forest/10 text-forest">
            {sessionTypeLabels[session.sessionType] ?? session.sessionType}
          </span>
          {isLocked && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gold/15 text-gold">
              <Lock size={12} />
              Qulflangan
            </span>
          )}
        </div>
        <span className="text-sm text-ink-soft">
          {formatDate(session.sessionDate)}
        </span>
      </div>

      <div>
        <p className="text-sm text-ink-soft">Guruh</p>
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

          <ControlledSelect
            control={form.control}
            name="roomId"
            label="Xona"
            options={roomOptions}
            disabled={isLocked}
          />

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
              <button
                type="submit"
                disabled={updateSession.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
              >
                {updateSession.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
